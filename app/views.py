from flask import Blueprint, render_template, request, current_app
from .reddit import RedditApp

views = Blueprint('views', __name__)



@views.route('/', methods=['GET', 'POST'])

def home():
    redditApp = RedditApp(client_id = current_app.config["CLIENT_ID"],
                         client_secret = current_app.config["CLIENT_SECRET"],
                         username = current_app.config["PRAW_USERNAME"],
                         password = current_app.config["PRAW_PASSWORD"],
                         user_agent = current_app.config["USER_AGENT"])

    postContent = ""
    if request.method =='POST':
        postURL = str(request.form.get('postURL'))
        postContent = redditApp.getPostContent(postURL)

    return render_template("home.html", postContent = postContent)
