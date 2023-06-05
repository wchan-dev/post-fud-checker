from flask import Blueprint, request, jsonify, g
from ..services.reddit import RedditApp
from ..services.sentiment_analysis import (
    analyzeSentimentWordsOnly,
    getMostFrequent,
    getPostSentiment,
    getOverallPostSentiment,
    getCommentSentiment,
)
from ..services.database import DatabaseHandler

sentiment = Blueprint("sentiment", __name__)


@sentiment.route("/api/sentiment/reddit-post-sentiment", methods=["GET"])
def get_sentiment_frequency():
    redditApp = RedditApp(g.reddit)
    db = DatabaseHandler(g.db)
    postURL = request.json.get("reddit_url")
    allComments = redditApp.getPostComments(postURL)
    positive_words, negative_words, neutral_words = [], [], []
    for sentence in allComments:
        pos, neg, neu = analyzeSentimentWordsOnly(sentence)
        positive_words.extend(pos)
        negative_words.extend(neg)
        neutral_words.extend(neu)

    num = 10
    pos_freq = getMostFrequent(positive_words, num)
    neg_freq = getMostFrequent(negative_words, num)
    neu_freq = getMostFrequent(neutral_words, num)
    db.call_stored_posts(redditApp.getPostContent(postURL))

    return jsonify(
        {
            "positive_words": pos_freq,
            "negative_words": neg_freq,
            "neutral_words": neu_freq,
        }
    )


@sentiment.route("/api/sentiment/overAllSentiment", methods=["GET"])
def getOverallSentiment():
    redditApp = RedditApp(g.reddit)
    postURL = request.json.get("reddit_url")
    allComments = redditApp.getPostComments(postURL)
    overAllSentiment = getOverallPostSentiment(allComments)
    return jsonify({"overall_post_sentiment": overAllSentiment})


@sentiment.route("/api/sentiment/getRandom", methods=["GET"])
def getRandom():
    randomSubreddit = redditApp.reddit.get_random_subreddit("random")
    return jsonify(randomSubreddit)


@sentiment.route("/api/sentiment/test", methods=["POST"])
def analyzePostSentiment():
    redditApp = RedditApp(g.reddit)
    db = DatabaseHandler(g.db)
    postURL = request.json.get("postURL")
    results = []
    id = ""
    commentsTimed = redditApp.getPostComments(postURL)
    submission = redditApp.getPostContent(postURL)
    title_sentiment, content_sentiment = getPostSentiment(
        submission.title, submission.selftext
    )
    summation_score = title_sentiment["compound"] + content_sentiment["compound"]
    post_compound = title_sentiment["compound"] + content_sentiment["compound"]
    post_neg = title_sentiment["neg"] + content_sentiment["neg"]
    post_pos = title_sentiment["pos"] + content_sentiment["pos"]
    post_neu = title_sentiment["neu"] + content_sentiment["neu"]
    db.call_store_post(
        submission, post_compound, post_neg, post_neu, post_pos, summation_score
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

    return jsonify(post=submission.title, comments=results)


@sentiment.route("api/sentiment/initial", methods=["POST"])
def initialRandomSentiment():
    redditApp = RedditApp(g.reddit)
    db = DatabaseHandler(g.db)
    postURL = redditApp.getRandomSubmission()
    results = []
    id = ""
    commentsTimed = redditApp.getPostComments(postURL)
    submission = redditApp.getPostContent(postURL)
    title_sentiment, content_sentiment = getPostSentiment(
        submission.title, submission.selftext
    )
    summation_score = title_sentiment["compound"] + content_sentiment["compound"]
    post_compound = title_sentiment["compound"] + content_sentiment["compound"]
    post_neg = title_sentiment["neg"] + content_sentiment["neg"]
    post_pos = title_sentiment["pos"] + content_sentiment["pos"]
    post_neu = title_sentiment["neu"] + content_sentiment["neu"]
    db.call_store_post(
        submission, post_compound, post_neg, post_neu, post_pos, summation_score
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

    return jsonify(post=submission.title, comments=results)
