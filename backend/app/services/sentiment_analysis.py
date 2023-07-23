from nltk.sentiment.vader import SentimentIntensityAnalyzer


def calculate_comment_sentiment(comment: str) -> dict[str, float]:
    sid = SentimentIntensityAnalyzer()
    raw_scores = sid.polarity_scores(comment)
    raw_scores.update((key, float(value) * 100) for key, value in raw_scores.items())
    return raw_scores


def calculate_post_baseline(
    title_sentiment_compound: float,
    content_sentiment_compound: float,
    upvote_ratio: float,
) -> float:
    # case 2: emphasis on content sentiment
    alpha = 0.2  # title_sentiment
    beta = 0.6  # content_sentiment
    gamma = 0.2  # upvote_sentiment

    baseline_score = (
        alpha * title_sentiment_compound
        + beta * content_sentiment_compound
        + gamma * upvote_ratio
    ) / (alpha + beta + gamma)

    return baseline_score


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


def calculate_moving_average(
    sentiment_scores_compound: list[float], window_size: int
) -> list[float]:
    # Moving Average(i) = (si-k+1 + si-k+2 + ... + si) / k
    # window_size: number of comments over the moving average calc so far
    moving_averages = []

    for i in range(window_size, len(sentiment_scores_compound) + 1):
        window = sentiment_scores_compound[i - window_size : i]
        average = sum(window) / window_size
        moving_averages.append(average)

    return moving_averages
