from .database_handler import db


class RedditSubmission(db.Model):
    __tablename__ = "submission"
    __table_args__ = {"schema": "reddit"}
    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Text, nullable=False)
    self_text = db.Column(db.String, nullable=False)
    title = db.Column(db.String, nullable=False)
    num_comments = db.Column(db.Integer, nullable=False)
    sentiment_positive = db.Column(db.Float, nullable=False)
    sentiment_neutral = db.Column(db.Float, nullable=False)
    sentiment_negative = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    # Relationships
    comments = db.relationships("RedditComment", backref="post", lazy=True)


class RedditComment(db.Model):
    __tablename__ = "comments"
    __table_args__ = {"schema": "reddit"}

    id = db.Column(db.Integer, primary_key=True)
    parent_submission_id = db.Column(
        db.String, db.ForeignKey("reddit.submission.id"), nullable=False
    )
    sentiment_positive = db.Column(db.Float, nullable=False)
    sentiment_neutral = db.Column(db.Float, nullable=False)
    sentiment_negative = db.Column(db.Float, nullable=False)
    self_text = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
