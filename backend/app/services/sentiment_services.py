from flask import Response, jsonify

from .services.sentiment_analysis import (
    get_post_title_content_sentiment,
    calculate_comment_sentiment,
    calculate_post_title_content_sentiment,
)

from .reddit import RedditApp

from ..models.database.reddit_models import RedditSubmission
from ..models.database_handler import (
    store_submission_raw,
    store_comment_raw,
    get_previous_results,
)

from ..utils.helpers import calc_num_comments

from typing import Union

import datetime
from prawcore.exceptions import RequestException


def calculate_and_store_comment_sentiment(
    comments: list[dict[str, Union[str, int]]], db_submission_id: int
) -> list[dict[str, Union[str, int, float]]]:
    results = []
    for idx, comment in enumerate(comments):
        comment_sentiment = calculate_comment_sentiment(comment["body"])
        store_comment_raw(
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
    post_sentiment = calculate_post_title_content_sentiment(
        title_sentiment, content_sentiment
    )

    db_submission_id = store_submission_raw(
        submission,
        post_sentiment["post_pos"],
        post_sentiment["post_neu"],
        post_sentiment["post_neg"],
        post_sentiment["post_compound"],
    )
    return db_submission_id, post_sentiment


def analyze_and_store_sentiments(
    postURL: str, redditApp: RedditApp, submission: RedditSubmission
) -> Union[dict, Response]:
    submission_use, comments_use = get_previous_results(submission.id, redditApp)
    submission_date = datetime.datetime.utcfromtimestamp(submission.created_utc)
    submission_subreddit = submission.subreddit.display_name

    if submission_use is None:
        submission_use = submission
        try:
            comments_use = redditApp.getPostComments(postURL)
        except RequestException:
            return (
                jsonify({"error": "Reddit API Limit Reached, please try again later."}),
                429,
            )

    else:
        comment_count_diff = calc_num_comments(
            submission.num_comments, submission_use.num_comments
        )
        if (
            (comment_count_diff) / submission.num_comments
        ) / submission.num_comments > 0.25:
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

    return {
        "post_title": submission.title,
        "comments": results,
        "postURL": postURL,
        "comment_count_diff": 0,
        "submission_date": submission_date,
        "subreddit": submission_subreddit,
    }
