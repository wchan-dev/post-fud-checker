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
    summation_score,
    requests_made,
) -> int:
    new_submission = RedditSubmission(
        submission_id=submission.id,
        selftext=submission.selftext,
        title=submission.title,
        num_comments=submission.num_comments,
        sentiment_positive=sentiment_positive,
        sentiment_neutral=sentiment_neutral,
        sentiment_negative=sentiment_negative,
        sentiment_compound=sentiment_compound,
        permalink=submission.permalink,
        summation_score=summation_score,
        timestamp=datetime.fromtimestamp(submission.created_utc),
        requests_made=requests_made,
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
    summation_score,
):
    new_comment = RedditComment(
        parent_submission_id=parent_id,
        body=comment["body"],
        permalink=comment["permalink"],
        sentiment_positive=sentiment_positive,
        sentiment_neutral=sentiment_neutral,
        sentiment_negative=sentiment_negative,
        sentiment_compound=sentiment_compound,
        summation_score=summation_score,
        timestamp=comment["created_utc"],
    )

    db.session.add(new_comment)
    db.session.commit()


def get_submission_by_id(submission_id: str):
    submission = RedditSubmission.query.filter_by(submission_id=submission_id).first()
    if submission:
        return submission
    else:
        return None


def get_comments_by_submission_id(submission_id):
    submission = RedditSubmission.query.filter_by(submission_id=submission_id).first()
    if submission:
        comments = [comment.to_dict() for comment in submission.comments]
        return comments
    else:
        return None
