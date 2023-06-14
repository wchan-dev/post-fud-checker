from flask import Flask
from .services.reddit import create_reddit_instance
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_pyfile("config.py")
    db.init_app(app)  # Inits SQLAlchemy object within App

    from .views.sentiment import sentiment

    with app.app_context():
        db.create_all()

    app.register_blueprint(sentiment, url_prefix="/")

    @app.before_request
    def before_request():
        create_reddit_instance(app)
        with app.app_context():
            db.create_all()

    return app
