from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from .models import RedditComment

db = SQLAlchemy()  # Global SQLAlchemy object


def create_and_store_comment(comment):
    new_comment = RedditComment()
