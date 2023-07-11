import praw
from flask import g
from datetime import datetime


import logging


class RequestCounterHandler(logging.StreamHandler):
    # this is inaccurate, it doesn't hit the limit of the api as it should i believe
    def __init__(self):
        super().__init__()
        self.request_count = 0

    def emit(self, record):
        if record.msg.startswith("Fetching:"):
            self.request_count += 1
        super().emit(record)


counter_handler = RequestCounterHandler()
counter_handler.setLevel(logging.DEBUG)

logger = logging.getLogger("prawcore")
logger.setLevel(logging.DEBUG)
logger.addHandler(counter_handler)


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
        comments = sorted(
            comments, key=lambda x: x["created_utc"]
        )  # sorts by time, don't remove, the order of how plotly renders does materr
        return comments, counter_handler.request_count

    def getPostCommentsLimited(self, submissionURL: str):
        comments = []
        submission = self.reddit.submission(url=submissionURL)
        submission.comments.replace_more(limit=1)
        for top_level_comment in submission.comments:
            comments.append(
                {
                    "body": top_level_comment.body,
                    "permalink": top_level_comment.permalink,
                    "created_utc": datetime.fromtimestamp(
                        top_level_comment.created_utc
                    ),
                },
            )
        if hasattr(top_level_comment, "replies"):
            top_level_comment.replies.replace_more(limit=1)
            for reply in top_level_comment.replies.list():
                comments.append(
                    {
                        "body": reply.body,
                        "permalink": reply.permalink,
                        "created_utc": datetime.fromtimestamp(reply.created_utc),
                    },
                )

        comments = sorted(
            comments, key=lambda x: x["created_utc"]
        )  # sorts by time, don't remove, the order of how plotly renders does materr
        return comments

    def getTopLevelPostComments(self, submissionURL: str):
        comments = []
        submission = self.reddit.submission(url=submissionURL)

        for top_level_comment in submission.comments:
            comments.append(
                {
                    "body": top_level_comment.body,
                    "permalink": top_level_comment.permalink,
                    "created_utc": datetime.fromtimestamp(
                        top_level_comment.created_utc
                    ),
                },
            )
        comments = sorted(
            comments, key=lambda x: x["created_utc"]
        )  # sorts by time, don't remove, the order of how plotly renders does materr

        return comments

    def getRandomSubmission(self) -> str:
        # should only do it for 100+comment submissions
        isFound = False
        permalink = ""
        comment_threshold = 100
        while isFound is False:
            random_submission = self.reddit.subreddit("all").random()
            if random_submission.num_comments >= comment_threshold:
                permalink = "https://www.reddit.com/" + random_submission.permalink
                isFound = True
        return permalink

    # sentiment growth since post inception
    # start out with the post content
    # then by top level comments
