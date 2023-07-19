from flask import Response, jsonify

from .services.sentiment_analysis import (
    get_post_title_content_sentiment,
    combine_post_content_sentiment,
    calculate_comment_sentiment,
)

from .reddit import RedditApp

from ..models.database.reddit_models import RedditSubmission
from ..models.database_handler import (
    store_submission_raw,
    store_submission_sentiment,
    store_comments_with_sentiments,
    get_previous_results,
)

from ..utils.helpers import calc_num_comments

from typing import Union

import datetime
from prawcore.exceptions import RequestException


def store_all_comment_sentiments(
    comments: list[dict[str, Union[str, int]]], db_submission_id: int
) -> list[dict[str, Union[str, int, float]]]:
    results = []
    for idx, comment in enumerate(comments):
        comment_sentiment = calculate_comment_sentiment(comment["body"])
        results.append(comment_sentiment)

        return results


def calculate_and_store_post_sentiment(
    submission,
) -> dict[str, float]:
    title_sentiment, content_sentiment = get_post_title_content_sentiment(
        submission.title, submission.selftext
    )

    post_sentiment = combine_post_content_sentiment(title_sentiment, content_sentiment)

    store_submission_sentiment(
        submission.id,
        post_sentiment["pos"],
        post_sentiment["neu"],
        post_sentiment["neg"],
        post_sentiment["compound"],
    )
    return post_sentiment


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

    db_submission_id = store_submission_raw(submission)
    _ = calculate_and_store_post_sentiment(db_submission_id)

    comments_with_sentiments = []
    for comment in comments_use:
        comment_sentiment = calculate_comment_sentiment(
            comment
        )  # Assuming this function exists
        comments_with_sentiments.append(
            {"comment": comment, "sentiment": comment_sentiment}
        )
    store_comments_with_sentiments(comments_with_sentiments, db_submission_id)

    return {
        "post_title": submission.title,
        "comments": comments_with_sentiments,
        "postURL": postURL,
        "comment_count_diff": 0,
        "submission_date": submission_date,
        "subreddit": submission_subreddit,
    }
