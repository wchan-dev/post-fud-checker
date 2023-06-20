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

    comments = db.relationship("RedditComment", backref="submission", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "submission_id": self.submission_id,
            "selftext": self.selftext,
            "title": self.title,
            "num_comments": self.num_comments,
            "sentiment_positive": self.sentiment_positive,
            "sentiment_neutral": self.sentiment_neutral,
            "sentiment_negative": self.sentiment_negative,
            "sentiment_compound": self.sentiment_compound,
            "summation_score": self.summation_score,
            "permalink": self.permalink,
            "created_utc": self.timestamp.isoformat(),  # convert datetime to string,
            # created_utc is kept due to naming
            "comments": [
                comment.to_dict() for comment in self.comments
            ],  # convert comments to dict
        }


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

    def to_dict(self):
        return {
            "id": self.id,
            "parent_submission_id": self.parent_submission_id,
            "body": self.body,
            "permalink": self.permalink,
            "sentiment_positive": self.sentiment_positive,
            "sentiment_neutral": self.sentiment_neutral,
            "sentiment_negative": self.sentiment_negative,
            "sentiment_compound": self.sentiment_compound,
            "summation_score": self.summation_score,
            "created_utc": self.timestamp.isoformat(),  # convert datetime to string
        }
