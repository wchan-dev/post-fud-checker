from .database_handler import db


class RedditComment(db.Model):
    __tablename__ = "reddit_comments"
    __table_args = {"schema": "reddit"}
    id = db.Column(db.Integer, primary_key=True)
    parent_submission_id = db.Column(db.String, nullable=False)
    sentiment_positive = db.Column(db.Float, nullable=False)
    sentiment_neutral = db.Column(db.Float, nullable=False)
    sentiment_negative = db.Column(db.Float, nullable=False)
    self_text = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
