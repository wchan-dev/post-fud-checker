from .... import db


class RedditSubmissionSentiment(db.Model):
    __tablename__ = "submission_sentiment"
    __table_args__ = {"schema": "reddit"}
    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Integer, db.ForeignKey("reddit.submission.id"))
    sentiment_positive = db.Column(db.Float)
    sentiment_neutral = db.Column(db.Float)
    sentiment_negative = db.Column(db.Float)
    sentiment_compound = db.Column(db.Float)

    submission = db.relationship("RedditSubmission", back_populates="sentiment")

    def to_dict(self):
        return {
            "sentiment_positive": self.sentiment_positive,
            "sentiment_neutral": self.sentiment_neutral,
            "sentiment_negative": self.sentiment_negative,
            "sentiment_compound": self.sentiment_compound,
        }


class RedditCommentSentiment(db.Model):
    __tablename__ = "comment_sentiment"
    __table_args__ = {"schema": "reddit"}
    id = db.Column(db.Integer, primary_key=True)
    comment_id = db.Column(db.Integer, db.ForeignKey("reddit.comments.id"))
    sentiment_positive = db.Column(db.Float)
    sentiment_neutral = db.Column(db.Float)
    sentiment_negative = db.Column(db.Float)
    sentiment_compound = db.Column(db.Float)

    comment = db.relationship("RedditComment", back_populates="sentiment")

    def to_dict(self):
        return {
            "sentiment_positive": self.sentiment_positive,
            "sentiment_neutral": self.sentiment_neutral,
            "sentiment_negative": self.sentiment_negative,
            "sentiment_compound": self.sentiment_compound,
        }
