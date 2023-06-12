from flask import Flask, g
from flask_sqlalchemy import SQLAlchemy
from .database.database_handler import connect_db
from .services.reddit import create_reddit_instance


def create_app() -> Flask:
    global db
    app = Flask(__name__)
    app.config.from_pyfile("config.py")

    app.register_blueprint(sentiment, url_prefix="/")

    @app.before_request
    def before_request():
        create_reddit_instance(app)
        connect_db(app)

    @app.after_request
    def after_request(response):
        if g.db is not None:
            g.db.close()
        return response

    return app
