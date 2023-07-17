from flask import Blueprint, request, jsonify, g
from ..services.sentiment_analysis import (
    get_post_title_content_sentiment,
    calculate_comment_sentiment,
    calculate_post_title_sentiment,
)

from ..models.database_handler import (
    store_submission,
    store_comment,
    get_previous_results,
)

from ..models.reddit import RedditApp
from ..models.database.reddit_models import RedditSubmission

import os
import datetime
from prawcore.exceptions import RequestException

from typing import Union

sentiment = Blueprint("sentiment", __name__)


def calculate_and_store_comment_sentiment(
    comments: list[dict[str, Union[str, int]]], db_submission_id: int
) -> list[dict[str, Union[str, int, float]]]:
    results = []
    for idx, comment in enumerate(comments):
        comment_sentiment = calculate_comment_sentiment(comment["body"])
        store_comment(
            comment["id"],
            comment_sentiment["pos"],
            comment_sentiment["neu"],
            comment_sentiment["neg"],
            comment_sentiment["compound"],
        )

        comment_dict = {
            **comment,
            **comment_sentiment,
        }

        results.append(comment_dict)
    return results


def calculate_and_store_submission_sentiment(
    submission: RedditSubmission,
) -> tuple[int, dict[str, float]]:
    title_sentiment, content_sentiment = get_post_title_content_sentiment(
        submission.title, submission.selftext
    )
    post_sentiment = calculate_post_title_sentiment(title_sentiment, content_sentiment)

    db_submission_id = store_submission(
        submission,
        post_sentiment["post_pos"],
        post_sentiment["post_neu"],
        post_sentiment["post_neg"],
        post_sentiment["post_compound"],
    )
    return db_submission_id, post_sentiment


def analyze_and_store_sentiments(
    postURL: str, redditApp: RedditApp, submission: RedditSubmission
) -> Union[tuple[dict, int], dict]:
    submission_use, comments_use = get_previous_results(submission.id, redditApp)
    submission_date = datetime.datetime.utcfromtimestamp(submission.created_utc)
    submission_subreddit = submission.subreddit.display_name

    if submission_use is None:
        submission_use = submission
        try:
            comments_use = redditApp.getPostComments(postURL)
        except RequestException:
            return (
                jsonify(error="Reddit API Limit Reached, please try again later."),
                429,
            )

    else:
        comment_count_diff = calc_num_comments(
            submission.num_comments, submission_use.num_comments
        )
        if (
            (comment_count_diff) / submission.num_comments
        ) / submission.num_comments > 0.25:
            print("pulling from reddit api for preexisting")
            submission_use = submission
            comments_use = redditApp.getPostComments(postURL)

    (
        db_submission_id,
        post_sentiment,
        summation_score,
    ) = calculate_and_store_submission_sentiment(submission_use)
    results, summation_score = calculate_and_store_comment_sentiment(
        comments_use, db_submission_id, summation_score
    )

    return jsonify(
        post_title=submission.title,
        comments=results,
        postURL=postURL,
        comment_count_diff=0,
        submission_date=submission_date,
        subreddit=submission_subreddit,
    )


def calc_num_comments(current_num_comments: int, previous_num_comments: int) -> int:
    return current_num_comments - previous_num_comments


@sentiment.route(os.environ.get("POST_SENTIMENT_ANALYSIS"), methods=["POST"])
def analyze_sentiment():
    redditApp = RedditApp(g.reddit)
    postURL = request.json.get("reddit_url")
    submission = redditApp.reddit.submission(url=postURL)
    results = analyze_and_store_sentiments(postURL, redditApp, submission)

    return results


@sentiment.route(os.environ.get("POST_SENTIMENT_ANALYSIS_INITIAL"), methods=["POST"])
def analyze_sentiment_from_random_submission():
    redditApp = RedditApp(g.reddit)
    postURL = redditApp.getRandomSubmission()
    submission = redditApp.reddit.submission(url=postURL)
    results = analyze_and_store_sentiments(postURL, redditApp, submission)

    return results
