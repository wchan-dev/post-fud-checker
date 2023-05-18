import praw
from praw.models import MoreComments

class RedditApp:
    def __init__(self, client_id, client_secret, user_agent, username, password):
        self.reddit = praw.Reddit(
            client_id = client_id,
            client_secret = client_secret,
            user_agent = user_agent,
            username = username,
            password = password)

    def getPostContent(self, submissionURL:str) -> str:
        submission = self.reddit.submission(url=submissionURL)
        return submission.selftext

    def getPostComments(self, submissionId:str) -> list[str]:
        comments = []
        submission = self.reddit.submission(submissionId)
        submission.comments.replace_more(limit=None)
        for comment in submission.comments.list():
            comments.append(comment.body)
        return comments
