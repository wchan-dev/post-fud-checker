from nltk.sentiment.vader import SentimentIntensityAnalyzer
from datetime import timedelta


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


def calculate_moving_average(comments_with_sentiments, post_lifetime, num_comments):
    # static typing for this is just a mess, just do this
    # until we can implement a proper class
    # Moving Average(i) = (si-k+1 + si-k+2 + ... + si) / k
    # window_size: number of comments over the moving average calc so far
    # we'll use a window_size of 15 minutes for now

    weight_lifetime = 0.5
    weight_comments = 0.5

    # Calculate window size based on post's lifetime and number of comments
    window_size_based_on_lifetime = max(15, post_lifetime / 12)  # updated constant
    window_size_based_on_comments = max(15, num_comments / 16.67)  # updated constant

    # Use weighted average to calculate final window size
    # Also, as post_lifetime and num_comments are in minutes,
    # we need to ensure that the timedelta is also expressed in minutes.
    window_size = timedelta(
        minutes=(
            weight_lifetime * window_size_based_on_lifetime
            + weight_comments * window_size_based_on_comments
        )
        / (weight_lifetime + weight_comments)
    )

    moving_averages = []

    for i in range(len(comments_with_sentiments)):
        current_time = comments_with_sentiments[i]["comment"]["timestamp"]

        # initialize window of comments and total sentiment score
        window_comments = []
        total_sentiment = 0.0

        # iterate backwards through prev coments until we reach one
        # out of window

        for j in range(i, -1, -1):
            previous_time = comments_with_sentiments[j]["comment"]["timestamp"]
            if current_time - previous_time <= window_size:
                # within window, add its sentiment
                total_sentiment += comments_with_sentiments[j]["sentiment"]["compound"]
                window_comments.append(comments_with_sentiments[j])
            else:
                break

        # calculate the average within the window
        if window_comments:
            average_sentiment = total_sentiment / len(window_comments)

            moving_average_sentiment_data = {
                "current_time": current_time,
                "moving_average_sentiment": average_sentiment,
            }
            moving_averages.append(moving_average_sentiment_data)

    return moving_averages
