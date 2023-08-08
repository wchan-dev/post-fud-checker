from flask import Flask
from .services.reddit import create_reddit_instance
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_pyfile("config.py")

    from .views.sentiment import sentiment

    app.register_blueprint(sentiment, url_prefix="/")

    @app.before_request
    def before_request():
        create_reddit_instance(app)

    return app
