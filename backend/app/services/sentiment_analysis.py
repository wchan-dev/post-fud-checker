import nltk

# eventually add options to use either nltk, text-blob, or flair (for accuracy)

from nltk.corpus import wordnet as wn
from nltk.corpus import sentiwordnet as swn
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer

from nltk.sentiment.vader import SentimentIntensityAnalyzer

from collections import namedtuple
from collections import Counter

from .news_parser.helpers import contains_links
from .news_parser.articles import filter_text, patterns

nltk.download("sentiwordnet")
nltk.download("wordnet")


def penn_to_wn(tag):
    if tag.startswith("N"):
        return wn.NOUN
    elif tag.startswith("V"):
        return wn.VERB
    elif tag.startswith("R"):
        return wn.ADV
    elif tag.startswith("J"):
        return wn.ADJ
    return None


Sentiment = namedtuple("Sentiment", ["word", "positive", "negative"])


def analyzeSentimentWordsOnly(  # analyzes sentiment of individual words only
    sentence: str,
):
    token = nltk.word_tokenize(sentence)
    after_tagging = pos_tag(token)
    lemmatizer = WordNetLemmatizer()
    positiveResults, negativeResults, neutralResults = [], [], []
    for word, tag in after_tagging:
        positive, negative = 0.0, 0.0
        wn_tag = penn_to_wn(tag)
        if wn_tag not in (wn.NOUN, wn.ADJ, wn.ADV):
            continue
        lemma = lemmatizer.lemmatize(word, pos=wn_tag)
        if not lemma:
            continue
        synsets = wn.synsets(lemma, pos=wn_tag)
        if not synsets:
            continue
        synset = synsets[0]
        swn_synset = swn.senti_synset(synset.name())
        positive = swn_synset.pos_score()
        negative = swn_synset.neg_score()
        sentiment = Sentiment(lemma, positive, negative)
        classification = classifySentiment(positive, negative)
        if classification == "Positive":
            positiveResults.append(sentiment)
        elif classification == "Negative":
            negativeResults.append(sentiment)
        elif classification == "Neutral":
            neutralResults.append(sentiment)

    return (
        positiveResults,
        negativeResults,
        neutralResults,
    )


def getCommentSentiment(comment: str):
    sid = SentimentIntensityAnalyzer()
    raw_scores = sid.polarity_scores(comment)
    raw_scores.update(
        (key, "{:.2f}".format(float(value) * 100)) for key, value in raw_scores.items()
    )
    return raw_scores


def getPostSentiment(title: str, selftext: str) -> (dict[str, float], dict[str, float]):
    sid = SentimentIntensityAnalyzer()
    title_score = sid.polarity_scores(title)
    # check if link
    links = contains_links(selftext)
    if links != "":
        selftext = filter_text(links, patterns)

    content_score = sid.polarity_scores(selftext)
    return title_score, content_score


def calcPostSentiment(title_sentiment, content_sentiment):
    summation_score = title_sentiment["compound"] + content_sentiment["compound"]
    post_compound = title_sentiment["compound"] + content_sentiment["compound"]
    post_neg = title_sentiment["neg"] + content_sentiment["neg"]
    post_pos = title_sentiment["pos"] + content_sentiment["pos"]
    post_neu = title_sentiment["neu"] + content_sentiment["neu"]

    return {
        "summation_score": summation_score,
        "post_compound": post_compound,
        "post_neg": post_neg,
        "post_pos": post_pos,
        "post_neu": post_neu,
    }


def getOverallPostSentiment(comments: list[str]) -> float:
    sid = SentimentIntensityAnalyzer()
    total_score = 0.0
    for comment in comments:
        score = sid.polarity_scores(comment)["compound"]
        total_score += score
    avg_score = round(total_score / len(comments), 3) * 100
    return avg_score


def classifySentiment(pos_score: float, neg_score: float) -> str:
    if pos_score > neg_score:
        return "Positive"
    elif pos_score < neg_score:
        return "Negative"
    else:
        return "Neutral"


def getMostFrequent(sentimentList: list[Sentiment], num: int):
    freq = [sentiment.word for sentiment in sentimentList]
    counts = Counter(freq)
    most_frequent = counts.most_common(num)
    return most_frequent
