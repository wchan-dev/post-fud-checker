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


class PostInformation:
    def __init__(
        self, submission_id, permalink, title, content, comments, upvote_ratio
    ):
        self.submission_id = submission_id
        self.permalink = permalink
        self.title = title
        self.content = content
        self.comments = comments
        self.upvote_ratio = upvote_ratio


class RedditApp:
    def __init__(self, reddit_instance):
        self.reddit = reddit_instance

    def getSubRedditContent(self, subreddit: str):
        return None

    def getPostContent(self, submissionURL: str) -> PostInformation:
        submission = self.reddit.submission(url=submissionURL)
        postTitle = submission.title
        content = submission.selftext
        comments = submission.num_comments
        upvote_ratio = submission.upvote_ratio
        postInformation = PostInformation(
            permalink=submissionURL,
            content=content,
            title=postTitle,
            comments=comments,
            upvote_ratio=upvote_ratio,
        )
        return postInformation

    def getPostComments(self, submissionURL: str) -> list[str]:
        comments = []
        submission = self.reddit.submission(url=submissionURL)
        submission.comments.replace_more(limit=None)
        for comment in submission.comments.list():
            comments.append(comment.body)
        return comments

    def getPostCommentsTimed(self, submissionURL: str) -> list[tuple[str, datetime]]:
        comments = []
        submission = self.reddit.submission(url=submissionURL)
        submission.comments.replace_more(limit=None)
        for comment in submission.comments.list():
            comments.append((comment.body, datetime.fromtimestamp(comment.created_utc)))
        comments = sorted(comments, key=lambda x: x[1])  # sorts by time
        return comments

    # sentiment growth since post inception
    # start out with the post content
    # then by top level comments
