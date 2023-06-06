import praw
from flask import g
from datetime import datetime


class PostInformation:
    def __init__(
        self, title, permalink, submission_id, selftext, upvote_ratio, post_timestamp
    ):
        self.title = title
        self.permalink = permalink
        self.submission_id = submission_id
        self.selftext = selftext
        self.upvote_ratio = upvote_ratio
        self.post_timestamp = post_timestamp


class CommentInformation:
    def __init__self(
        self, comment_id, compound, neg, neu, pos, summation_score, comment_timestamp
    ):
        self.comment_id = comment_id
        self.compound = compound
        self.neg = neg
        self.neu = neu
        self.pos = pos
        self.summation_score = summation_score
        self.comment_timestamp = comment_timestamp


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

    def getPostContent(self, submissionURL: str) -> PostInformation:
        submission = self.reddit.submission(url=submissionURL)
        submission_id = submission.id
        selftext = submission.selftext
        permalink = submission.permalink
        postTitle = submission.title
        upvote_ratio = submission.upvote_ratio
        post_timestamp = datetime.fromtimestamp(submission.created_utc)
        postInformation = PostInformation(
            title=postTitle,
            permalink=permalink,
            selftext=selftext,
            submission_id=submission_id,
            upvote_ratio=upvote_ratio,
            post_timestamp=post_timestamp,
        )
        return postInformation

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
