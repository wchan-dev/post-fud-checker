import praw
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

    def getSubRedditContent(self, subreddit: str):
        return None

    def getPostComments(self, submissionURL: str):
        comments = []
        submission = self.reddit.submission(url=submissionURL)
        submission.comments.replace_more(limit=None)
        for comment in submission.comments.list():
            comments.append((comment, datetime.fromtimestamp(comment.created_utc)))
        comments = sorted(
            comments, key=lambda x: x[1]
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
