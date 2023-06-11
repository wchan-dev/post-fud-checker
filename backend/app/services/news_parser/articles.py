from bs4 import BeautifulSoup
import requests
import re
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.tag import pos_tag


patterns = [
    r"refresh the page",
    r"log in",
    r"Or if you would prefer",
    r"Want an ad-free experience?",
    r"Copyright 2023",
    r"All rights reserved",
    r"Want to bookmark your favourite articles and stories to read or reference later?"
    r"The associated Press.",
]


def filter_sentences(sentences, patterns):
    filtered_sentences = []
    for sentence in sentences:
        if not any(re.search(pattern, sentence, re.IGNORECASE) for pattern in patterns):
            filtered_sentences.append(sentence)
    return filtered_sentences


def filter_text(text, patterns):
    # export this one for use
    sentences = sent_tokenize(text)  # split the text into sentences
    filtered_sentences = filter_sentences(sentences, patterns)
    filtered_text = "".join(filtered_sentences)
    return filtered_text


def getText(URL):
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, "html.parser")
    paragraphs = soup.find_all("p")
    text = ""
    for paragraph in paragraphs:
        text += paragraph.get_text()
    return text
