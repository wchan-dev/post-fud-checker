import pytest
from unittest.mock import patch, MagicMock

from app.services.sentiment_analysis import calculate_comment_sentiment


@patch("nltk.sentiment.vader.SentimentIntensityAnalyzer")
def test_calculate_comment_sentiment(mock_analyzer):
    mock_sid = MagicMock()
    mock_sid.polarity_scores.return_value = {
        "neg": 0.0,
        "neu": 0.5080,
        "pos": 0.4920,
        "compound": 0.4404,
    }
    mock_analyzer.return_value = mock_sid

    comment = "this is a good comment"
    result = calculate_comment_sentiment(comment)
    assert result == {
        "neg": "0.00",
        "neu": "50.80",
        "pos": "49.20",
        "compound": "44.04",
    }
