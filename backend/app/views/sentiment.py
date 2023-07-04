from flask import Blueprint, request, jsonify, g
from ..services.reddit import RedditApp
from ..services.sentiment_analysis import (
    calculate_post_sentiment,
    calculate_comment_sentiment,
    calcPostSentiment,
)
from ..database.database_handler import (
    store_submission,
    store_comment,
    get_submission_by_id,
    get_comments_by_submission_id,
)
import os

sentiment = Blueprint("sentiment", __name__)


def analyze_and_store_sentiments(postURL, redditApp, submission):
    # need to make comparison between number of comments now and then
    submission_use, comments_use = get_previous_results(submission.id, redditApp)
    # can we pull both the submission num comments and the db comments first?
    if submission_use is None:
        submission_use = submission
        comments_use = redditApp.getPostComments(postURL)
    else:
        comment_count_diff = calc_num_comments(
            submission.num_comments, submission_use.num_comments
        )
        if (
            comment_count_diff > 50
            or ((comment_count_diff) / submission.num_comments)
            / submission.num_comments
            > 0.1
        ):
            submission_use = submission
            comments_use = redditApp.getPostComments(postURL)
            print("aleady has submission but will pull from it")
        else:
            return jsonify(
                post_title=submission_use.title,
                comments=comments_use,
                postURL=postURL,
                comment_count_diff=comment_count_diff,
            )

    comments_use = redditApp.getPostComments(postURL)
    title_sentiment, content_sentiment = calculate_post_sentiment(
        submission_use.title, submission_use.selftext
    )
    post_sentiment = calcPostSentiment(title_sentiment, content_sentiment)
    summation_score = float(post_sentiment["post_compound"])

    db_submission_id = store_submission(
        submission_use,
        post_sentiment["post_pos"],
        post_sentiment["post_neu"],
        post_sentiment["post_neg"],
        post_sentiment["post_compound"],
        summation_score,
    )

    results = []
    for idx, comment in enumerate(comments_use):
        comment_sentiment = calculate_comment_sentiment(comment["body"])
        store_comment(
            comment,
            db_submission_id,
            comment_sentiment["pos"],
            comment_sentiment["neu"],
            comment_sentiment["neg"],
            comment_sentiment["compound"],
            summation_score,
        )
        summation_score += float(comment_sentiment["compound"]) / (2 + idx)
        print("summation_score" + "[" + str(idx + 2) + "]: " + str(summation_score))

        comment_dict = {
            **comment,
            **comment_sentiment,
            "summation_score": summation_score,
        }
        results.append(comment_dict)

    return jsonify(
        post_title=submission.title,
        comments=results,
        postURL=postURL,
        comment_count_diff=0,
    )


def calc_num_comments(submission_curr: int, submission_prev: int):
    return submission_curr - submission_prev


def get_previous_results(submission_id, redditApp):
    # check if submission id exists in database
    db_submission = get_submission_by_id(submission_id)
    if db_submission:
        db_comments = get_comments_by_submission_id(submission_id)
        return db_submission, db_comments
    else:
        return None, None


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
