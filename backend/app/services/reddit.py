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
    def __init__(self, title, permalink, submission_id, upvote_ratio, post_timestamp):
        self.title = title
        self.permalink = permalink
        self.submission_id = submission_id
        self.upvote_ratio = upvote_ratio
        self.post_timestamp = post_timestamp


class CommentInformation:
    def __init__self(self, submission, permalink, parent_id, score, comment_timestamp):
        self.submission = submission.id
        self.permalink = permalink
        self.parent_id = parent_id
        self.score = score
        self.comment_timestamp = comment_timestamp


class RedditApp:
    def __init__(self, reddit_instance):
        self.reddit = reddit_instance

    def getSubRedditContent(self, subreddit: str):
        return None

    def getPostContent(self, submissionURL: str) -> PostInformation:
        submission = self.reddit.submission(url=submissionURL)
        submission_id = submission.id
        permalink = submission.selftext
        postTitle = submission.title
        upvote_ratio = submission.upvote_ratio
        post_timestamp = datetime.fromtimestamp(submission.created_utc)
        postInformation = PostInformation(
            title=postTitle,
            permalink=permalink,
            submission_id=submission_id,
            upvote_ratio=upvote_ratio,
            post_timestamp=post_timestamp,
        )
        return postInformation

    def getPostComments(self, submissionURL: str) -> list[str]:
        comments = []
        submission = self.reddit.submission(url=submissionURL)
        submission.comments.replace_more(limit=None)
        for comment in submission.comments.list():
            comments.append(comment.body)
        return comments

    def getPostCommentsTimed(self, submissionURL: str):
        comments = []
        submission = self.reddit.submission(url=submissionURL)
        submission.comments.replace_more(limit=None)
        for comment in submission.comments.list():
            comments.append((comment, datetime.fromtimestamp(comment.created_utc)))
        comments = sorted(comments, key=lambda x: x[1])  # sorts by time
        return comments

    # sentiment growth since post inception
    # start out with the post content
    # then by top level comments
