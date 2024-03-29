from flask import Response, jsonify
from app.models.mongo_manager import MongoManager

from .sentiment_analysis import (
    get_post_title_content_sentiment,
    combine_post_content_sentiment,
    calculate_post_baseline,
    calculate_comment_sentiment,
    calculate_moving_average,
    calculate_sentiment_average,
)

from .reddit import RedditApp

from ..models.database.reddit_models import RedditSubmission

from ..utils.helpers import calc_num_comments

from typing import Union

from datetime import datetime
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
    submission, db_submission_id: int
) -> (int, dict[str, float]):
    title_sentiment, content_sentiment = get_post_title_content_sentiment(
        submission.title, submission.selftext
    )

    post_sentiment = combine_post_content_sentiment(title_sentiment, content_sentiment)
    post_sentiment_baseline = calculate_post_baseline(
        title_sentiment["compound"],
        content_sentiment["compound"],
        submission.upvote_ratio,
    )

    post_sentiment = {**post_sentiment, "baseline": post_sentiment_baseline}
    return db_submission_id, post_sentiment


def analyze_and_store_sentiments(
    submissionURL: str, redditApp: RedditApp, submission: RedditSubmission
) -> Union[dict, Response]:
    # submission_use, comments_use = get_previous_results(submission.id, redditApp)
    # commenting out for debugging until refactor new db handler code

    sentiments_collection = MongoManager.get_sentiments_collection("sentiment_db_v1")

    existing_data = sentiments_collection.find_one({"_id": submission.id})
    if existing_data:
        comment_count_diff = calc_num_comments(
            submission.num_comments, len(existing_data["comments"])
        )
        if (
            (comment_count_diff) / submission.num_comments
        ) / submission.num_comments < 0.25:
            print(existing_data)
            return existing_data

    comments_use = None
    try:
        comments_use = redditApp.getPostComments(submissionURL)
    except RequestException:
        return (
            jsonify({"error": "Reddit API Limit Reached, please try again later."}),
            429,
        )

    submission_date = datetime.utcfromtimestamp(submission.created_utc)
    submission_subreddit = submission.subreddit.display_name
    best_comments = redditApp.get_best_comments(submissionURL)
    controversial_comments = redditApp.get_most_controversial_comments(submissionURL)

    _, post_sentiment = calculate_and_store_post_sentiment(submission, 1)

    comments_with_sentiments = []
    comment_sentiments_compound = []

    # temporary workaround to get demo working
    for comment in comments_use:
        comment_sentiment = calculate_comment_sentiment(
            comment["body"]
        )  # Assuming this function exists
        comments_with_sentiments.append(
            {"comment": comment, "sentiment": comment_sentiment}
        )
        # for calculating moving average
        comment_sentiments_compound.append(comment_sentiment["compound"])

    # sentiment analysis for best comments
    best_comments_with_sentiments = []
    for comment in best_comments:
        comment_sentiment = calculate_comment_sentiment(
            comment["body"]
        )  # Assuming this function exists
        best_comments_with_sentiments.append(
            {"comment": comment, "sentiment": comment_sentiment}
        )

    # sentiment analysis for most controversial comments
    controversial_comments_with_sentiments = []
    for comment in controversial_comments:
        comment_sentiment = calculate_comment_sentiment(
            comment["body"]
        )  # Assuming this function exists
        controversial_comments_with_sentiments.append(
            {"comment": comment, "sentiment": comment_sentiment}
        )

    # separated for readability from above loop
    # submission.num_comments != length of comments pulled
    post_lifetime_timedelta = datetime.utcnow() - submission_date
    post_lifetime = post_lifetime_timedelta.total_seconds() / 60
    moving_sentiment_average = calculate_moving_average(
        comments_with_sentiments, post_lifetime, submission.num_comments
    )

    sentiment_averaged = calculate_sentiment_average(comments_with_sentiments)

    data_to_insert = {
        "_id": submission.id,  # Using submission.id as the MongoDB document id
        "post_title": submission.title,
        "subreddit": submission_subreddit,
        "postURL": submissionURL,
        "submission_date": submission_date,
        "sentiment_baseline": post_sentiment["baseline"],
        "moving_sentiment_average": moving_sentiment_average,
        "sentiments_averaged": sentiment_averaged,
        "comments": comments_with_sentiments,
        "best_comments": best_comments_with_sentiments,
        "controversial_comments": controversial_comments_with_sentiments,
    }

    sentiments_collection.insert_one(data_to_insert)

    return data_to_insert
