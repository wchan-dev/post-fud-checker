from .. import db


class RedditSubmission(db.Model):
    __tablename__ = "submission"
    __table_args__ = {"schema": "reddit"}
    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Text, nullable=False)
    selftext = db.Column(db.String, nullable=False)
    title = db.Column(db.String, nullable=False)
    num_comments = db.Column(db.Integer, nullable=False)
    sentiment_positive = db.Column(db.Float, nullable=False)
    sentiment_neutral = db.Column(db.Float, nullable=False)
    sentiment_negative = db.Column(db.Float, nullable=False)
    sentiment_compound = db.Column(db.Float, nullable=False)
    summation_score = db.Column(db.Float, nullable=False)
    permalink = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    comments = db.relationship("RedditComment", backref="post", lazy=True)


class RedditComment(db.Model):
    __tablename__ = "comments"
    __table_args__ = {"schema": "reddit"}

    id = db.Column(db.Integer, primary_key=True)
    parent_submission_id = db.Column(
        db.Integer, db.ForeignKey("reddit.submission.id"), nullable=False
    )
    body = db.Column(db.String, nullable=False)
    permalink = db.Column(db.String, nullable=False)
    sentiment_positive = db.Column(db.Float, nullable=False)
    sentiment_neutral = db.Column(db.Float, nullable=False)
    sentiment_negative = db.Column(db.Float, nullable=False)
    sentiment_compound = db.Column(db.Float, nullable=False)
    summation_score = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
