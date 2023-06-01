from flask import g
import psycopg2


def connect_db(app):
    if "db" not in g:
        g.db = psycopg2.connect(app.config["DATABASE_URL"])
    return g.db


class DatabaseHandler:
    def __init__(self, database_instance):
        self.db = database_instance

    def call_stored_posts(self, PostInformation):
        cursor = self.db.cursor()
        cursor.callproc(
            "reddit.store_post",
            (
                PostInformation.title,
                PostInformation.permalink,
                PostInformation.submission_id,
                PostInformation.upvote_ratio,
                PostInformation.post_timestamp,
            ),
        )
        self.db.commit()

    def call_store_comments(
        self, submission, permalink, parent_id, score, comment_timestamp
    ):
        cursor = self.db.cursor()
        cursor.execute(
            "CALL reddit.store_comment(%s, %s, %s, %s, %s)",
            (
                submission,
                permalink,
                parent_id,
                score,
                comment_timestamp,
            ),
        )
        self.db.commit()

    def call_store_comment_sentiment(
        self, comment_id, compound, neg, neu, pos, comment_timestamp
    ):
        cursor = self.db.cursor()
        cursor.execute(
            "CALL reddit.store_sentiments(%s, %s, %s, %s, %s,%s)",
            (comment_id, compound, neg, neu, pos, comment_timestamp),
        )
        self.db.commit()
