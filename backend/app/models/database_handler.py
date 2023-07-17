from datetime import datetime
from . import RedditSubmission, RedditComment
from . import RedditSubmissionSentiment, RedditCommentSentiment
from .. import db


def store_submission_raw(
    submission,
) -> int:
    new_submission = RedditSubmission(
        submission_id=submission.id,
        selftext=submission.selftext,
        title=submission.title,
        num_comments=submission.num_comments,
        timestamp=datetime.fromtimestamp(submission.created_utc),
    )

    db.session.add(new_submission)
    db.session.commit()
    return new_submission.id


def store_submission_sentiment(
    submission_id,
    sentiment_positive,
    sentiment_neutral,
    sentiment_negative,
    sentiment_compound,
    summation_score,
):
    sentiment = RedditSubmissionSentiment(
        submission_id=submission_id,
        sentiment_positive=sentiment_positive,
        sentiment_neutral=sentiment_neutral,
        sentiment_negative=sentiment_negative,
        sentiment_compound=sentiment_compound,
        summation_score=summation_score,
    )
    db.session.add(sentiment)
    db.session.commit()


def store_comment_raw(
    comment,
    parent_id,
):
    new_comment = RedditComment(
        parent_submission_id=parent_id,
        body=comment["body"],
        permalink=comment["permalink"],
        timestamp=comment["created_utc"],
    )

    db.session.add(new_comment)
    db.session.commit()


def store_comment_sentiment(
    comment_id,
    sentiment_positive,
    sentiment_neutral,
    sentiment_negative,
    sentiment_compound,
    summation_score,
):
    sentiment = RedditCommentSentiment(
        comment_id=comment_id,
        sentiment_positive=sentiment_positive,
        sentiment_neutral=sentiment_neutral,
        sentiment_negative=sentiment_negative,
        sentiment_compound=sentiment_compound,
        summation_score=summation_score,
    )
    db.session.add(sentiment)
    db.session.commit()


def get_submission_by_id(submission_id: str):
    submission = RedditSubmission.query.filter_by(submission_id=submission_id).first()
    if submission:
        return submission
    else:
        return None


def get_comments_by_submission_id(submission_id):
    # return sorted by date oldest to newest
    submission = RedditSubmission.query.filter_by(submission_id=submission_id).first()
    if submission:
        comments = [comment.to_dict() for comment in submission.comments]
        return comments
    else:
        return None


def get_previous_results(submission_id, redditApp):
    db_submission = get_submission_by_id(submission_id)
    if db_submission:
        db_comments = get_comments_by_submission_id(submission_id)
        return db_submission, db_comments
    else:
        return None, None
