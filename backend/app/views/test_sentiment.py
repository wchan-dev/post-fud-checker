import pytest
from unittest.mock import Mock, patch
from flask import json
from .. import create_app

import os
from .sentiment import analyze_sentiment


@pytest.fixture()
def client():
    app = create_app(test_config=None)
    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client


@patch("..services.reddit.RedditApp")
@patch("flask.request")
def test_analyze_sentiment(mock_request, mock_RedditApp, client):
    mock_request.json = {"postURL": "http://example.com"}

    mock_redditApp = Mock()
    mock_redditApp.getPostComments.return_value = []
    mock_RedditApp.return_value = mock_redditApp

    # Send a post request to the endpoint
    response = client.post(
        os.environ.get("POST_SENTIMENT_ANALYSIS"),
        data=json.dumps(mock_request.json),
        content_type="application/json",
    )

    # Check that the status code indicates success
    assert response.status_code == 200

    # Parse the response data from json
    data = json.loads(response.data)
    print(data)

    # Add assertions based on what you expect in the response
    # ...
