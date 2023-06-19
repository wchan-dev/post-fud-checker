import pytest

from .. import create_app
from flask_sqlalchemy import SQLAlchemy


@pytest.fixture
def client():
    app = create_app()

    app.config["TESTING"] = True
    app.testing = True

    app.config[
        "SQLALCHEMY_DATABASE_URI"
    ] = "postgresql://admin:your_password@localhost:5432/test_db"

    yield app


def test_store_submission(test_app):
    type(obj)
