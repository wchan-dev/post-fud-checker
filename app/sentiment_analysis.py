import nltk
from nltk.corpus import wordnet as wn
from nltk.corpus import sentiwordnet as swn
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer


from collections import namedtuple
from collections import Counter

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


def analyzeSentiment(
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


def classifySentiment(pos_score: float, neg_score: float) -> str:
    if pos_score > neg_score:
        return "Positive"
    elif pos_score < neg_score:
        return "Negative"
    else:
        return "Neutral"


sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "At the stroke of midnight, the city fell silent.",
    "She studied for hours to ace the test.",
    "Despite the heavy rain, they continued their journey.",
    "The sun set behind the mountains, painting the sky in shades of pink and purple.",
    "Everyday, he took a different route to work to break the monotony.",
    "Laughter is the best medicine, they say.",
    "Books are portals to different worlds.",
    "The most important thing in life is to be happy.",
    "Art is a reflection of society and its various nuances.",
    "The aroma of freshly baked bread filled the air.",
    "It was a cold, winter night with a sky full of stars.",
    "Without music, life would be a mistake.",
]

positive_words = []
negative_words = []
neutral_words = []

for sentence in sentences:
    pos, neg, neu = analyzeSentiment(sentence)
    positive_words.extend(pos)
    negative_words.extend(neg)
    neutral_words.extend(neu)


# lets go for top 5 most comon words for now

# most frequent positive
freq_pos = [sentiment.word for sentiment in positive_words]
pos_counts = Counter(freq_pos)
pos_most_frequent = pos_counts.most_common(5)
print(pos_most_frequent)

# most frequent negative
freq_neg = [sentiment.word for sentiment in negative_words]
neg_counts = Counter(freq_neg)
neg_most_frequent = neg_counts.most_common(5)
print(neg_most_frequent)

# most frequent neutral
freq_neu = [sentiment.word for sentiment in neutral_words]
neu_counts = Counter(freq_neu)
neu_most_frequent = neu_counts.most_common(5)
print(neu_most_frequent)

labels, values = zip(*pos_most_frequent)
x_pos = range(len(labels))
plt.bar(x_pos, values, alpha=0.7)
plt.xticks(x_pos,labels)

plt.xlabel('Word')
plt.ylabel('Frequency')
plt.title('Most Frequent Positve Words')

plt.show()
