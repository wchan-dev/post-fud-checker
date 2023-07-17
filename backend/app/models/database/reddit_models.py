from .... import db


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
    comment_id = db.Column(db.String, unique=True)
    parent_submission_id = db.Column(
        db.Integer, db.ForeignKey("reddit.submission.id"), nullable=False
    )
    body = db.Column(db.String, nullable=False)
    permalink = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    sentiment = db.relationship(
        "RedditCommentSentiment", useList=False, back_populates="comment"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "comment_id": self.comment_id,
            "parent_submission_id": self.parent_submission_id,
            "body": self.body,
            "permalink": self.permalink,
            "sentiment": self.sentiment.to_dict() if self.sentiment else None,
            "timestamp": self.timestamp.isoformat(),  # convert datetime to string
        }
