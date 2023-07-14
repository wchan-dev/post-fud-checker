import nltk


from nltk.sentiment.vader import SentimentIntensityAnalyzer

from collections import Counter


def calculate_comment_sentiment(comment: str):
    sid = SentimentIntensityAnalyzer()
    raw_scores = sid.polarity_scores(comment)
    raw_scores.update(
        (key, "{:.2f}".format(float(value) * 100)) for key, value in raw_scores.items()
    )
    return raw_scores


def get_post_title_content_sentiment(
    title: str, selftext: str
) -> (dict[str, float], dict[str, float]):
    sid = SentimentIntensityAnalyzer()
    title_score = sid.polarity_scores(title)
    content_score = sid.polarity_scores(selftext)
    title_score.update(
        (key, "{:.2f}".format(float(value) * 100)) for key, value in title_score.items()
    )
    content_score.update(
        (key, "{:.2f}".format(float(value) * 100))
        for key, value in content_score.items()
    )

    return title_score, content_score


def calculate_post_title_content_sentiment(title_sentiment, content_sentiment):
    post_compound = float(title_sentiment["compound"]) + float(
        content_sentiment["compound"]
    )
    post_neg = float(title_sentiment["neg"]) + float(content_sentiment["neg"])
    post_pos = float(title_sentiment["pos"]) + float(content_sentiment["pos"])
    post_neu = float(title_sentiment["neu"]) + float(content_sentiment["neu"])

    return {
        "post_compound": post_compound,
        "post_neg": post_neg,
        "post_pos": post_pos,
        "post_neu": post_neu,
    }
