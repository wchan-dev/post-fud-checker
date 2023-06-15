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
    submission = redditApp.reddit.submission(url=postURL)
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
    summation_score = float(post_sentiment["post_compound"])
    print("this is first summatio_score: " + str(summation_score))
    for idx, comment in enumerate(comments):
        comment_sentiment = getCommentSentiment(comment["body"])
        store_comment(
            comment,
            db_submission_id,
            comment_sentiment["pos"],
            comment_sentiment["neu"],
            comment_sentiment["neg"],
            comment_sentiment["compound"],
        )
        summation_score += float(comment_sentiment["compound"]) / (2 + idx)
        print("summation_score" + "[" + str(idx + 2) + "]: " + str(summation_score))

        comment_dict = {
            **comment,
            **comment_sentiment,
            "summation_score": summation_score,
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
