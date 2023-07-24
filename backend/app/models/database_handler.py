from datetime import datetime
from typing import List, Tuple, Optional

from .database.reddit_models import RedditSubmission, RedditComment
from .database.sentiment_models import RedditSubmissionSentiment, RedditCommentSentiment
from .. import db


def store_submission_raw(submission) -> int:
    new_submission = RedditSubmission(
        submission_id=submission.id,
        selftext=submission.selftext,
        title=submission.title,
        num_comments=submission.num_comments,
        permalink=submission.permalink,
        timestamp=datetime.utcfromtimestamp(submission.created_utc),
        upvote_ratio=submission.upvote_ratio,
    )

    db.session.add(new_submission)
    db.session.commit()
    return new_submission.id


def store_submission_sentiment(
    submission_id: int,
    sentiment_positive: float,
    sentiment_neutral: float,
    sentiment_negative: float,
    sentiment_compound: float,
    sentiment_baseline: float,
) -> None:
    sentiment = RedditSubmissionSentiment(
        submission_id=submission_id,
        sentiment_positive=sentiment_positive,
        sentiment_neutral=sentiment_neutral,
        sentiment_negative=sentiment_negative,
        sentiment_compound=sentiment_compound,
        sentiment_baseline=sentiment_baseline,
    )
    db.session.add(sentiment)
    db.session.commit()


def store_comments_with_sentiments(
    comments_with_sentiments: list[dict],
    parent_id: int,
) -> None:
    for comment_with_sentiment in comments_with_sentiments:
        new_comment = RedditComment(
            parent_submission_id=parent_id,
            body=comment_with_sentiment["comment"]["body"],
            score=comment_with_sentiment["comment"]["score"],
            permalink=comment_with_sentiment["comment"]["permalink"],
            timestamp=comment_with_sentiment["comment"]["timestamp"],
        )
        db.session.add(new_comment)
        db.session.flush()  # So that new_comment.id is available

        new_sentiment = RedditCommentSentiment(
            comment_id=new_comment.id,
            sentiment_positive=comment_with_sentiment["sentiment"]["pos"],
            sentiment_neutral=comment_with_sentiment["sentiment"]["neu"],
            sentiment_negative=comment_with_sentiment["sentiment"]["neg"],
            sentiment_compound=comment_with_sentiment["sentiment"]["compound"],
        )
        db.session.add(new_sentiment)

    db.session.commit()


def get_submission_by_id(submission_id: str) -> Optional[RedditSubmission]:
    submission = RedditSubmission.query.filter_by(submission_id=submission_id).first()
    if submission:
        return submission
    else:
        return None


def get_comments_by_submission_id(submission_id: str) -> Optional[List[dict]]:
    # return sorted by date oldest to newest
    submission = RedditSubmission.query.filter_by(submission_id=submission_id).first()
    if submission:
        comments = [comment.to_dict() for comment in submission.comments]
        return comments
    else:
        return None


def get_previous_results(
    submission_id: str, redditApp
) -> Tuple[Optional[RedditSubmission], Optional[List[dict]]]:
    db_submission = get_submission_by_id(submission_id)
    if db_submission:
        db_comments = get_comments_by_submission_id(submission_id)
        return db_submission, db_comments
    else:
        return None, None
