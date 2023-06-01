from flask import Blueprint, request, jsonify, g
from ..services.reddit import RedditApp
from ..services.sentiment_analysis import (
    analyzeSentimentWordsOnly,
    getMostFrequent,
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


@sentiment.route("/api/sentiment/test", methods=["GET"])
def getCommentsTimed():
    redditApp = RedditApp(g.reddit)
    db = DatabaseHandler(g.db)
    postURL = request.json.get("reddit_url")
    results = []
    commentsTimed = redditApp.getPostCommentsTimed(postURL)
    for comments in commentsTimed:
        sentiment_score = getCommentSentiment(comments[0].body)
        new_tpl = (comments[0].body, comments[1], sentiment_score)
        # db.call_store_comments(
        #     comments[0].submission.id,
        #     comments[0].permalink,
        #     comments[0].parent_id,
        #     comments[0].score,
        #     comments[1],
        # )
        db.call_store_comment_sentiment(
            comments[0].submission.id,
            sentiment_score["compound"],
            sentiment_score["neg"],
            sentiment_score["neu"],
            sentiment_score["pos"],
            comments[1],
        )
        results.append(new_tpl)

    return jsonify(results)
