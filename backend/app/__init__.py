from flask import Flask


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_pyfile('config.py')

    from .views.home import home
    app.register_blueprint(home, url_prefix='/')

    return app

