import nltk

from nltk.corpus import wordnet as wn
from nltk.corpus import sentiwordnet as swn
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer

from nltk.sentiment.vader import SentimentIntensityAnalyzer

from collections import namedtuple
from collections import Counter

import base64
from io import BytesIO
import matplotlib
import matplotlib.pyplot as plt

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


def analyzeSentimentWordsOnly( #analyzes sentiment of individual words only
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

def getOverallPostSentiment(comments: list[str]) -> float:
    sid = SentimentIntensityAnalyzer()
    total_score = 0.0
    for comment in comments:
        score = sid.polarity_scores(comment)['compound']
        total_score += score
    avg_score = round(total_score/len(comments), 3) * 100
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

def plotMostFrequent(wordList: list[tuple], title:str):
    matplotlib.use('agg')
    labels, values = zip(*wordList)
    x_pos = range(len(labels))
    plt.bar(x_pos,values, alpha = 0.7)
    plt.xticks(x_pos,labels)

    plt.xlabel('Words')
    plt.ylabel("Frequency")
    plt.title(title)

    tmpfile = BytesIO()
    plt.savefig(tmpfile, format='png')
    plt.close()
    encoded = base64.b64encode(tmpfile.getvalue()).decode('utf-8')
    return encoded

