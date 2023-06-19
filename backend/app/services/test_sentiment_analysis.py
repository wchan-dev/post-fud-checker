from .sentiment_analysis import calculate_comment_sentiment


def test_calculate_comment_sentiment():
    comment = "I love this product!"
    sentiment_scores = calculate_comment_sentiment(comment)

    for value in sentiment_scores.values():
        assert 0 <= float(value) <= 100

    # check for float conversion
    assert float(sentiment_scores["pos"]) > 1
