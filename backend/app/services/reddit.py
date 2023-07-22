import praw
import prawcore
from flask import g
from datetime import datetime

from typing import Union


def create_reddit_instance(app) -> praw.Reddit:
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

    def getPostComments(
        self, submissionURL: str
    ) -> list[dict[str, Union[str, datetime]]]:
        comments = []
        try:
            submission = self.reddit.submission(url=submissionURL)
            # sort by new guarantees in time order, must be before network fetching
            submission.comment_sort = "old"
            submission.comments.replace_more(limit=None)
            for comment in submission.comments.list():
                comments.append(
                    {
                        "body": comment.body,
                        "score": comment.score,
                        "permalink": comment.permalink,
                        "timestamp": datetime.fromtimestamp(comment.created_utc),
                    },
                )
            return comments

        except prawcore.exceptions.NotFound:
            raise Exception(f"No reddit post found at {submissionURL}")
        except prawcore.exceptions.RequestException:
            raise Exception("Reddit API rate limit reached. Please try again later")
