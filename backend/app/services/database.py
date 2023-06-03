from flask import g
import psycopg2
from psycopg2 import extras


def connect_db(app):
    if "db" not in g:
        g.db = psycopg2.connect(app.config["DATABASE_URL"])
    return g.db


class DatabaseHandler:
    def __init__(self, database_instance):
        self.db = database_instance

    def call_store_post(
        self, PostInformation, compound, neg, neu, pos, summation_score
    ):
        cursor = self.db.cursor()
        try:
            cursor.execute(
                "CALL reddit.store_post(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (
                    PostInformation.title,
                    PostInformation.permalink,
                    PostInformation.submission_id,
                    PostInformation.selftext,
                    compound,
                    neg,
                    neu,
                    pos,
                    summation_score,
                    PostInformation.upvote_ratio,
                    PostInformation.post_timestamp,
                ),
            )
        except (Exception, psycopg2.Error) as error:
            print("Error while inserting data into table", error)
        finally:
            self.db.commit()
            if cursor:
                cursor.close()

    def call_get_post(self, submission_id: str):
        cursor = self.db.cursor(cursor_factory=extras.RealDictRow)
        res = {}
        try:
            cursor.execute("CALL reddit.get_post(%s)", submission_id)
            res = cursor.fetchall()
        except (Exception, psycopg2.Error) as error:
            print("error fetching post", error)
        finally:
            if cursor:
                cursor.close()

        return res

    def call_store_comments(
        self, submission, permalink, parent_id, score, comment_timestamp
    ):
        cursor = self.db.cursor()
        try:
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
        except (Exception, psycopg2.Error) as error:
            print("error while inserting data into reddit.comments", error)
        finally:
            self.db.commit()
            if cursor:
                cursor.close()

    def call_store_comment_sentiment(
        self, comment_id, compound, neg, neu, pos, summation_score, comment_timestamp
    ):
        cursor = self.db.cursor()
        cursor.execute(
            "CALL reddit.store_sentiments(%s, %s, %s, %s, %s, %s,%s)",
            (comment_id, compound, neg, neu, pos, summation_score, comment_timestamp),
        )
        self.db.commit()

    def call_get_comment_sentiments(self, comment_id):
        res = []
        try:
            cursor = self.db.cursor(cursor_factory=extras.RealDictCursor)
            cursor.execute(
                "SELECT * FROM reddit.comment_sentiments WHERE comment_id = %s",
                (comment_id,),
            )
            comments = cursor.fetchall()
            # print(f"Fetched comments: {comments}")  # Debugging line
            res = comments
        except (Exception, psycopg2.Error) as error:
            print("Error while fetching data from PostgreSQL", error)
        finally:
            if cursor:
                cursor.close()
        return res
