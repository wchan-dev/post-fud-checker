import nltk
from nltk.sentiment import SentimentIntensityAnalyzer


def getSentimentBasic(comments:list[str]):
    sia = SentimentIntensityAnalyzer()
    for comment in comments:
        score = sia.polarity_scores(comment)
        print(score)


sentences = ["VADER is smart, handsome, and funny.",
             "VADER is smart, handsome, and funny!",
             "VADER is very smart, handsome, and funny.",
             "VADER is VERY SMART, handsome, and FUNNY.",
             "VADER is VERY SMART, handsome, and FUNNY!!!",
             "VADER is VERY SMART, really handsome, and INCREDIBLY FUNNY!!!"]

print(getSentimentBasic(sentences))
