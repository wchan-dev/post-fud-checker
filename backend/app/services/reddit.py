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
        self.bots = ["AutoModerator", "some_other_bot"]  # Add bot names here

    def getPostComments(
        self, submissionURL: str
    ) -> list[dict[str, Union[str, datetime]]]:
        comments = []
        try:
            submission = self.reddit.submission(url=submissionURL)
            submission.comment_limit = 1000
            submission.comment_sort = "best"
            if submission.num_comments > 500:
                submission.comments.replace_more(limit=8)
            else:
                submission.comments.replace_more(limit=None)

            for comment in submission.comments.list():
                if comment.author is not None and comment.author.name not in self.bots:
                    comments.append(
                        {
                            "body": comment.body,
                            "score": comment.score,
                            "permalink": comment.permalink,
                            # datetime.fromtimestamp will specify GMT by default
                            "timestamp": datetime.utcfromtimestamp(comment.created_utc),
                        },
                    )

            return comments

        except prawcore.exceptions.NotFound:
            raise Exception(f"No reddit post found at {submissionURL}")
        except prawcore.exceptions.RequestException:
            raise Exception("Reddit API rate limit reached. Please try again later")

    def get_best_comments(
        self, submissionURL: str
    ) -> list[dict[str, Union[str, datetime]]]:
        best_comments = []
        try:
            submission = self.reddit.submission(url=submissionURL)
            submission.comment_sort = "best"
            for comment in submission.comments[:5]:
                if comment.author is not None and comment.author.name not in self.bots:
                    best_comments.append(
                        {
                            "body": comment.body,
                            "score": comment.score,
                            "permalink": comment.permalink,
                            # datetime.fromtimestamp will specify GMT by default
                            "timestamp": datetime.utcfromtimestamp(comment.created_utc),
                        }
                    )
        except prawcore.exceptions.NotFound:
            raise Exception(f"No reddit post found at {submissionURL}")
        except prawcore.exceptions.RequestException:
            raise Exception("Reddit API rate limit reached. Please try again later")

        return best_comments

    def get_most_controversial_comments(
        self, submissionURL: str
    ) -> list[dict[str, Union[str, datetime]]]:
        controversial_comments = []
        try:
            submission = self.reddit.submission(url=submissionURL)
            submission.comment_sort = "controversial"
            for comment in submission.comments[:5]:
                if comment.author is not None and comment.author.name not in self.bots:
                    controversial_comments.append(
                        {
                            "body": comment.body,
                            "score": comment.score,
                            "permalink": comment.permalink,
                            # datetime.fromtimestamp will specify GMT by default
                            "timestamp": datetime.utcfromtimestamp(comment.created_utc),
                        }
                    )
        except prawcore.exceptions.NotFound:
            raise Exception(f"No reddit post found at {submissionURL}")
        except prawcore.exceptions.RequestException:
            raise Exception("Reddit API rate limit reached. Please try again later")

        return controversial_comments
