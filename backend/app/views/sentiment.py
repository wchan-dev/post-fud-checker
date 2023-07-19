from flask import Blueprint, jsonify, request, g
from ..services.reddit import RedditApp
from ..services.sentiment_services import analyze_and_store_sentiments

import os

from typing import Union

sentiment = Blueprint("sentiment", __name__)


@sentiment.route(os.environ.get("POST_SENTIMENT_ANALYSIS"), methods=["POST"])
def analyze_sentiment() -> Union[dict, tuple[dict, int]]:
    redditApp = RedditApp(g.reddit)
    postURL = request.json.get("reddit_url")
    submission = redditApp.reddit.submission(url=postURL)
    results = analyze_and_store_sentiments(postURL, redditApp, submission)

    return jsonify(results)


@sentiment.route(os.environ.get("POST_SENTIMENT_ANALYSIS_INITIAL"), methods=["POST"])
def analyze_sentiment_from_random_submission() -> Union[dict, tuple[dict, int]]:
    redditApp = RedditApp(g.reddit)
    postURL = redditApp.getRandomSubmission()
    submission = redditApp.reddit.submission(url=postURL)
    results = analyze_and_store_sentiments(postURL, redditApp, submission)

    return jsonify(results)
