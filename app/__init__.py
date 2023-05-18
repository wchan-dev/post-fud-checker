from flask import Flask
from .reddit import RedditApp

def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_pyfile('config.py')

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')


    return app



