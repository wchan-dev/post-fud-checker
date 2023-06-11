from flask import Blueprint, request, jsonify, g
from ..services.reddit import RedditApp
from ..services.sentiment_analysis import (
    getPostSentiment,
    getCommentSentiment,
    calcPostSentiment,
)
from ..database.database_handler import DatabaseHandler

sentiment = Blueprint("sentiment", __name__)


@sentiment.route("/api/sentiment/test", methods=["POST"])
def analyzePostSentiment():
    # add check to see if submission is already in database
    # do a num comments difference
    redditApp = RedditApp(g.reddit)
    db = DatabaseHandler(g.db)
    postURL = request.json.get("postURL")
    results = []
    commentsTimed = redditApp.getPostComments(postURL)
    submission = redditApp.reddit.submission(postURL)

    id = commentsTimed[0][0].submission.id

    title_sentiment, content_sentiment = getPostSentiment(
        submission.title, submission.selftext
    )
    post_sentiment = calcPostSentiment(title_sentiment, content_sentiment)
    summation_score = post_sentiment["summation_score"]
    db.call_store_post(
        submission,
        post_sentiment["post_compound"],
        post_sentiment["post_neg"],
        post_sentiment["post_neu"],
        post_sentiment["post_pos"],
        post_sentiment["summation_score"],
    )

    for i, comments in enumerate(commentsTimed):
        sentiment_score = getCommentSentiment(comments[0].body)
        summation_score = summation_score + float(sentiment_score["compound"])
        id = comments[0].submission.id
        db.call_store_comment_sentiment(
            comments[0].submission.id,
            sentiment_score["compound"],
            sentiment_score["neg"],
            sentiment_score["neu"],
            sentiment_score["pos"],
            summation_score / (i + 2),
            comments[1],
        )

    results = db.call_get_comment_sentiments(id)

    return jsonify(post=submission.title, comments=results, postURL=postURL)


@sentiment.route("api/sentiment/initial", methods=["POST"])
def initialRandomSentiment():
    redditApp = RedditApp(g.reddit)
    db = DatabaseHandler(g.db)
    postURL = redditApp.getRandomSubmission()
    results = []
    id = ""
    commentsTimed = redditApp.getPostComments(postURL)
    submission = redditApp.reddit.submission(postURL)
    title_sentiment, content_sentiment = getPostSentiment(
        submission.title, submission.selftext
    )
    post_sentiment = calcPostSentiment(title_sentiment, content_sentiment)
    summation_score = post_sentiment["summation_score"]
    db.call_store_post(
        submission,
        post_sentiment["post_compound"],
        post_sentiment["post_neg"],
        post_sentiment["post_neu"],
        post_sentiment["post_pos"],
        post_sentiment["summation_score"],
    )

    for i, comments in enumerate(commentsTimed):
        sentiment_score = getCommentSentiment(comments[0].body)
        summation_score = summation_score + float(sentiment_score["compound"])
        id = comments[0].submission.id
        db.call_store_comment_sentiment(
            comments[0].submission.id,
            sentiment_score["compound"],
            sentiment_score["neg"],
            sentiment_score["neu"],
            sentiment_score["pos"],
            summation_score / (i + 2),
            comments[1],
        )

    results = db.call_get_comment_sentiments(id)

    return jsonify(
        post=submission.title,
        comments=results,
        postURL=postURL,
    )
