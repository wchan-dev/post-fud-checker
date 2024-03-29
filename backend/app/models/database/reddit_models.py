from ... import db


class RedditSubmission(db.Model):
    __tablename__ = "submission"
    __table_args__ = {"schema": "reddit"}
    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Text, nullable=False)
    selftext = db.Column(db.String, nullable=False)
    title = db.Column(db.String, nullable=False)
    num_comments = db.Column(db.Integer, nullable=False)
    permalink = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    upvote_ratio = db.Column(db.Integer, nullable=False)
    sentiment = db.relationship(
        "RedditSubmissionSentiment", uselist=False, back_populates="submission"
    )
    comments = db.relationship("RedditComment", backref="submission", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "submission_id": self.submission_id,
            "selftext": self.selftext,
            "title": self.title,
            "num_comments": self.num_comments,
            "permalink": self.permalink,
            "timestamp": self.timestamp.isoformat(),  # convert datetime to string,
            "upvote_ratio": self.upvote_ratio,
            "comments": [comment.to_dict() for comment in self.comments],
        }


class RedditComment(db.Model):
    __tablename__ = "comments"
    __table_args__ = {"schema": "reddit"}

    id = db.Column(db.Integer, primary_key=True)
    parent_submission_id = db.Column(
        db.Integer, db.ForeignKey("reddit.submission.id"), nullable=False
    )
    body = db.Column(db.String, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    permalink = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    sentiment = db.relationship(
        "RedditCommentSentiment", uselist=False, back_populates="comment"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "parent_submission_id": self.parent_submission_id,
            "body": self.body,
            "score": self.score,
            "permalink": self.permalink,
            "sentiment": self.sentiment.to_dict() if self.sentiment else None,
            "timestamp": self.timestamp.isoformat(),  # convert datetime to string
        }
