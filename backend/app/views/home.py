from flask import Blueprint, request, current_app, jsonify, g
from ..services.reddit import RedditApp
from ..services.sentiment_analysis import analyzeSentimentWordsOnly, getMostFrequent, getOverallPostSentiment

home = Blueprint("home", __name__)

@home.route("/api/reddit-post-sentiment", methods=["GET"])
def get_sentiment_frequency():
    redditApp = RedditApp(
        client_id=current_app.config["CLIENT_ID"],
        client_secret=current_app.config["CLIENT_SECRET"],
        username=current_app.config["PRAW_USERNAME"],
        password=current_app.config["PRAW_PASSWORD"],
        user_agent=current_app.config["USER_AGENT"],
    )
    postURL = request.json.get('reddit_url')
    allComments = redditApp.getPostComments(postURL)
    positive_words,negative_words,neutral_words = [], [], []
    for sentence in allComments:
        pos, neg, neu = analyzeSentimentWordsOnly(sentence)
        positive_words.extend(pos)
        negative_words.extend(neg)
        neutral_words.extend(neu)

    num = 10
    pos_freq = getMostFrequent(positive_words, num)
    neg_freq = getMostFrequent(negative_words, num)
    neu_freq = getMostFrequent(neutral_words, num)

    return jsonify({"positive_words":pos_freq,
                    "negative_words":neg_freq,
                    "neutral_words":neu_freq})

@home.route("/api/overAllSentiment", methods=["GET"])
def getOverallSentiment():
    redditApp = RedditApp(
        client_id=current_app.config["CLIENT_ID"],
        client_secret=current_app.config["CLIENT_SECRET"],
        username=current_app.config["PRAW_USERNAME"],
        password=current_app.config["PRAW_PASSWORD"],
        user_agent=current_app.config["USER_AGENT"],
    )
    postURL = request.json.get('reddit_url')
    allComments = redditApp.getPostComments(postURL)
    overAllSentiment = getOverallPostSentiment(allComments)
    return jsonify({"overall_post_sentiment": overAllSentiment})
