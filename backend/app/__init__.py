from flask import Flask, g
from flask_sqlalchemy import SQLAlchemy
from .database.database_handler import db
from .services.reddit import create_reddit_instance


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_pyfile("config.py")

    db.init_app(app)  # Inits SQLAlchemy object within App

    app.register_blueprint(sentiment, url_prefix="/")

    @app.before_request
    def before_request():
        create_reddit_instance(app)
        with app.app_context():
            db.create_all()

    return app
