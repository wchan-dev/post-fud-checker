from flask import Blueprint, render_template, request, current_app
from .reddit import RedditApp, PostInformation
from .sentiment_analysis import analyzeSentiment, getMostFrequent, plotMostFrequent
from . import db

views = Blueprint("views", __name__)


@views.route("/", methods=["GET", "POST"])
def home():
    redditApp = RedditApp(
        client_id=current_app.config["CLIENT_ID"],
        client_secret=current_app.config["CLIENT_SECRET"],
        username=current_app.config["PRAW_USERNAME"],
        password=current_app.config["PRAW_PASSWORD"],
        user_agent=current_app.config["USER_AGENT"],
    )

    postInformation = PostInformation(
        permalink="", content="", title="", comments=0, upvote_ratio=0
    )

    pos_plot, neg_plot, neu_plot = None, None, None
    pos_freq,neg_freq,neu_freq = "","",""
    if request.method == "POST":
        postURL = str(request.form.get("postURL"))
        postInformation = redditApp.getPostContent(postURL)
        allComments = redditApp.getPostComments(postURL)
        positive_words = []
        negative_words = []
        neutral_words = []

        for sentence in allComments:
          pos, neg, neu = analyzeSentiment(sentence)
          positive_words.extend(pos)
          negative_words.extend(neg)
          neutral_words.extend(neu)

        num = 10
        pos_freq = getMostFrequent(positive_words, num)
        neg_freq = getMostFrequent(negative_words, num)
        neu_freq = getMostFrequent(neutral_words, num)

        pos_plot = plotMostFrequent(pos_freq, "Most Frequent Positive Words")
        neg_plot = plotMostFrequent(neg_freq, "Most Frequent Negative Words")
        neu_plot = plotMostFrequent(neu_freq, "Most Frequent Neutral Words")

    return render_template(
        "home.html",
        title=postInformation.title,
        comments=postInformation.comments,
        upvote_ratio=postInformation.upvote_ratio,
        pos_words=pos_freq,
        neg_words=neg_freq,
        neu_words=neu_freq,
        pos_plot=pos_plot,
        neg_pot=neg_plot,
        neu_plot=neu_plot
    )
