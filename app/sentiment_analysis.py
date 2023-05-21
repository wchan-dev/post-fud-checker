import nltk
from nltk.corpus import wordnet as wn
from nltk.corpus import sentiwordnet as swn
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer

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


def analyzeSentiment(sentence: str) -> float:
    sentiment = 0.0
    token = nltk.word_tokenize(sentence)
    after_tagging = pos_tag(token)
    lemmatizer = WordNetLemmatizer()
    for word, tag in after_tagging:
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
        sentiment += swn_synset.pos_score() - swn_synset.neg_score()

    return sentiment


sentences = [
    "VADER is smart, handsome, and funny.",
    "VADER is smart, handsome, and funny!",
    "VADER is very smart, handsome, and funny.",
    "VADER is VERY SMART, handsome, and FUNNY.",
    "VADER is VERY SMART, handsome, and FUNNY!!!",
    "VADER is VERY SMART, really handsome, and INCREDIBLY FUNNY!!!",
]
j = [1, 2, 3]

for sentence in sentences:
    print(analyzeSentiment(sentence))
