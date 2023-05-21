from flask import Blueprint, render_template, request, current_app
from .reddit import RedditApp, PostInformation
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

    if request.method == "POST":
        postURL = str(request.form.get("postURL"))
        postInformation = redditApp.getPostContent(postURL)
        # db.session.add(postInformation)

    return render_template(
        "home.html",
        title=postInformation.title,
        comments=postInformation.comments,
        upvote_ratio=postInformation.upvote_ratio,
    )
