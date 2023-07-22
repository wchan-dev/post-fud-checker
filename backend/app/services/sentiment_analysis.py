from nltk.sentiment.vader import SentimentIntensityAnalyzer


def calculate_comment_sentiment(comment: str) -> dict[str, float]:
    sid = SentimentIntensityAnalyzer()
    raw_scores = sid.polarity_scores(comment)
    raw_scores.update((key, float(value) * 100) for key, value in raw_scores.items())
    return raw_scores


def get_post_title_content_sentiment(
    title: str, selftext: str
) -> (dict[str, float], dict[str, float]):
    sid = SentimentIntensityAnalyzer()
    title_score = sid.polarity_scores(title)
    content_score = sid.polarity_scores(selftext)
    title_score.update((key, float(value) * 100) for key, value in title_score.items())
    content_score.update(
        (key, float(value) * 100) for key, value in content_score.items()
    )

    return title_score, content_score


def combine_post_content_sentiment(
    title_sentiment: dict[str, float], content_sentiment: dict[str, float]
):
    post_compound = title_sentiment["compound"] + content_sentiment["compound"]

    post_neg = title_sentiment["neg"] + content_sentiment["neg"]
    post_pos = title_sentiment["pos"] + content_sentiment["pos"]
    post_neu = title_sentiment["neu"] + content_sentiment["neu"]

    return {
        "compound": post_compound,
        "neg": post_neg,
        "pos": post_pos,
        "neu": post_neu,
    }
