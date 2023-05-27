from . import db
from flask_login import UserMixin


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))


class PostInformation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    permalink = db.Column(db.String(150))
    title = db.Column(db.String(150))
    content = db.Column(db.String())
    comments = db.Column(db.Integer)
    upvote_ratio = db.Column(db.Float(precision=32))
