import praw
import prawcore
from flask import g
from datetime import datetime


def create_reddit_instance(app):
    if "reddit" not in g:
        g.reddit = praw.Reddit(
            client_id=app.config["CLIENT_ID"],
            client_secret=app.config["CLIENT_SECRET"],
            username=app.config["PRAW_USERNAME"],
            password=app.config["PRAW_PASSWORD"],
            user_agent=app.config["USER_AGENT"],
        )
    return g.reddit


class RedditApp:
    def __init__(self, reddit_instance):
        self.reddit = reddit_instance

    def getPostComments(self, submissionURL: str):
        comments = []
        try:
            submission = self.reddit.submission(url=submissionURL)
            submission.comments.replace_more(limit=None)
            for comment in submission.comments.list():
                comments.append(
                    {
                        "body": comment.body,
                        "permalink": comment.permalink,
                        "created_utc": datetime.fromtimestamp(comment.created_utc),
                    },
                )
            return comments
        except prawcore.exceptions.NotFound:
            raise Exception(f"No reddit post found at {submissionURL}")
        except prawcore.exceptions.RequestException:
            raise Exception("Reddit API rate limit reached. Please try again later")
