from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///DaWeSysDatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Webpage(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    provider = db.Column(db.String(80),unique = True)
    url = db.Column(db.String(2000),unique = True)

    def __init__(self, provider,url):
        self.provider = provider
        self.url = url