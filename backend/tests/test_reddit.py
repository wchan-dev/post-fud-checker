import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime
from app.services.reddit import RedditApp, prawcore


@pytest.fixture
def reddit_app():
    reddit_instance = MagicMock()
    reddit_app = RedditApp(reddit_instance)
    return reddit_app


def test_getPostComments(reddit_app):
    mock_comment = MagicMock()
    mock_comment.body = "test comment"
    mock_comment.permalink = "/r/test/comments/id"
    mock_comment.created_utc = datetime.utcnow().timestamp()

    reddit_app.reddit.submission.return_value.comments.list.return_value = [
        mock_comment
    ]
    reddit_app.reddit.submission.return_value.comments.replace_more.return_value = None

    submission_url = "https://reddit.com/r/test/comments/id"

    comments = reddit_app.getPostComments(submission_url)

    # Basic tests to ensure our mocked data is returned
    assert len(comments) == 1
    assert comments[0]["body"] == "test comment"
    assert comments[0]["permalink"] == "/r/test/comments/id"


def test_getPostComments_raises_when_not_found(reddit_app):
    mock_response = MagicMock()
    mock_response.status_code = 404
    reddit_app.reddit.submission.side_effect = prawcore.exceptions.NotFound(
        response=mock_response
    )
    submission_url = "https://reddit.com/r/test/comments/id"

    with pytest.raises(Exception, match=f"No reddit post found at {submission_url}"):
        reddit_app.getPostComments(submission_url)


def test_getPostComments_raises_when_rate_limit_reached(reddit_app):
    reddit_app.reddit.submission.side_effect = prawcore.exceptions.RequestException(
        original_exception=Exception("Rate limit exceeded"),
        request_args=("GET", "https://reddit.com/r/test/comments/id"),
        request_kwargs={},
    )
    submission_url = "https://reddit.com/r/test/comments/id"

    with pytest.raises(
        Exception, match="Reddit API rate limit reached. Please try again later"
    ):
        reddit_app.getPostComments(submission_url)
