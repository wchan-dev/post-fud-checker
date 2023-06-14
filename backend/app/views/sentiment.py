from flask import Blueprint, request, jsonify, g, current_app
from ..services.reddit import RedditApp
from ..services.sentiment_analysis import (
    getPostSentiment,
    getCommentSentiment,
    calcPostSentiment,
)
from ..database.database_handler import store_submission, store_comment
import os

sentiment = Blueprint("sentiment", __name__)


def analyze_and_store_sentiments(postURL, redditApp):
    comments = redditApp.getPostComments(postURL)
    submission = redditApp.reddit.submission(postURL)

    title_sentiment, content_sentiment = getPostSentiment(
        submission.title, submission.selftext
    )
    post_sentiment = calcPostSentiment(title_sentiment, content_sentiment)
    db_submission_id = store_submission(
        submission,
        post_sentiment["post_pos"],
        post_sentiment["post_neu"],
        post_sentiment["post_neg"],
        post_sentiment["post_compound"],
    )

    results = []
    for idx, comment in enumerate(comments):
        comment_sentiment = getCommentSentiment(comment.selftext)
        store_comment(
            comment,
            db_submission_id,
            comment_sentiment["pos"],
            comment_sentiment["neu"],
            comment_sentiment["neg"],
            comment_sentiment["compound"],
        )

        comment_dict = {
            column.name: getattr(comment, column.name)
            for column in comment.__table__.columns
        }
        results.append(comment_dict)

    return jsonify(post=submission.title, comments=results, postURL=postURL)


@sentiment.route(os.environ.get("POST_SENTIMENT_ANALYSIS"), methods=["POST"])
def analyzePostSentiment():
    redditApp = RedditApp(g.reddit)
    postURL = request.json.get("postURL")

    results = analyze_and_store_sentiments(postURL, redditApp)

    return results


@sentiment.route(os.environ.get("POST_SENTIMENT_ANALYSIS_INITIAL"), methods=["POST"])
def initialRandomSentiment():
    redditApp = RedditApp(g.reddit)
    postURL = redditApp.getRandomSubmission()

    results = analyze_and_store_sentiments(postURL, redditApp)

    return results
