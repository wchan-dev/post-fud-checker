from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from .models import RedditSubmission, RedditComment
from .. import db


def store_submission(
    submission,
    sentiment_positive,
    sentiment_neutral,
    sentiment_negative,
    sentiment_compound,
) -> int:
    new_submission = RedditSubmission(
        submission_id=submission.id,
        self_text=submission.selftext,
        title=submission.title,
        num_comments=submission.num_comments,
        sentiment_positive=sentiment_positive,
        sentiment_neutral=sentiment_neutral,
        sentiment_negative=sentiment_negative,
        sentiment_compound=sentiment_compound,
        timestamp=datetime.fromtimestamp(submission.createdUTC),
    )

    db.session.add(new_submission)
    db.session.commit()
    return new_submission.id


def store_comment(
    comment,
    parent_id,
    sentiment_positive,
    sentiment_neutral,
    sentiment_negative,
    sentiment_compound,
):
    new_comment = RedditComment(
        parent_submission_id=parent_id,
        sentiment_positive=sentiment_positive,
        sentiment_neutral=sentiment_neutral,
        sentiment_negative=sentiment_negative,
        sentiment_compound=sentiment_compound,
        self_text=comment.selftext,
        timestamp=datetime.fromtimestamp(comment.createdUTC),
    )

    db.session.add(new_comment)
    db.session.commit()
