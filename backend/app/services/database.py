from flask import g
import psycopg2
from reddit import PostInformation


def connect_db(app):
    if "db" not in g:
        g.db = psycopg2.connect(app.config["DATABASE_URL"])
    return g.db


class DatabaseHandler:
    def __init__(self, database_instance):
        self.db = database_instance

    def call_stored_posts(self, PostInformation):
        return 0
