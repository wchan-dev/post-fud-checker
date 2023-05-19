import praw

class PostInformation:
    def __init__(self, permalink, title, content, comments, upvote_ratio):
        self.permalink = permalink
        self.title = title
        self.content = content
        self.comments = comments
        self.upvote_ratio = upvote_ratio

class RedditApp:
    def __init__(self, client_id, client_secret, user_agent, username, password):
        self.reddit = praw.Reddit(
            client_id = client_id,
            client_secret = client_secret,
            user_agent = user_agent,
            username = username,
            password = password)

    def getPostContent(self, submissionURL:str) -> PostInformation:
        submission = self.reddit.submission(url=submissionURL)
        postTitle = submission.title
        content = submission.selftext
        comments = submission.num_comments
        upvote_ratio = submission.upvote_ratio
        postInformation = PostInformation(permalink=submissionURL,
                                          content=content,
                                          title=postTitle,
                                          comments=comments,
                                          upvote_ratio=upvote_ratio)
        return postInformation

    def getPostComments(self, submissionId:str) -> list[str]:
        comments = []
        submission = self.reddit.submission(submissionId)
        submission.comments.replace_more(limit=None)
        for comment in submission.comments.list():
            comments.append(comment.body)
        return comments


