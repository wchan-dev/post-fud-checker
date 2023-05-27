from . import db

class PostInformation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    permalink = db.Column(db.String(150))
    title = db.Column(db.String(150))
    content = db.Column(db.String())
    comments = db.Column(db.Integer)
    upvote_ratio = db.Column(db.Float(precision=32))
