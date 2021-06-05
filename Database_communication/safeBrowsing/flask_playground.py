from os import name
from flask import Flask, render_template, jsonify, request, redirect, url_for
import database_playground
from flask_cors import CORS  # import with me with the following cmd: pip install flask-cors --upgrade
import re
import json
from interpret_whotracksme import generic_sql_query, calc_label, get_domain_by_url
import sqlite3

# from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import csv
from random import randrange
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///datenbank.db'


# db = SQLAlchemy(app)


# class website(db.Model):
#    id = db.Column(db.Integer, primary_key = True)
#    domain = db.Column(db.String, nullable = False)
#   rating = db.Column(db.Integer)
#    date_created = db.Column(db.DateTime, default=datetime.utcnow)
#
#   def __repr__(self):
#       return '<Task %r>' % self.id


# @app.route('/einlesen') # CVS Datei Top 50 einlesen und dann ausgeben lassen / provisorisch
# def index2():
#   with open('top50websites.csv','r') as csv_file:
#      csv_reader = csv.reader(csv_file)
#     for line in csv_reader:
#        if(line[2] != "Adult"): # keine pornoseiten bitte
#           r = (line[1].split('.')[0])
#          new_domain = website(domain = r,rating = randrange(10))  # zufälliges rating zwischen 1 und 9
#         db.session.add(new_domain)
#        db.session.commit()

# return redirect('/datenbank')


# @app.route('/datenbank') # Datenbank ausgeben
# def index():
#   session = db.session()
#  cursor = session.execute("SELECT * from website order by date_created desc").cursor
# rows = cursor.fetchall()
# return jsonify(rows)


@app.route('/')
def hello_world():
    return "Hello CODE"


@app.route('/s')
def calc_labels():
    # label calculation
    return "test"

# collecting the original full urls to replace on the search page
# still in progress - just for fun at the moment
# @author diana
# def collect_full_urls(urls):
#     full_urls = []
#     for url in urls:
#         full_urls.append(url)
#     return full_urls

@app.route('/sendurls/', methods=['POST'])
def receive_urls():
    urls = str(request.data)
    if urls.__contains__("http://"):
        print("unsafe web protocol found")
    urls = urls.split("https://")
    urls.pop(0)
    ###
    #full_urls = collect_full_urls(urls)
    ###
    domains = []
    for url in urls:
        domains.append(get_domain_by_url(url))
    domains = list(dict.fromkeys(domains))

    domains = calc_label(domains)

    #print(domains)

    return jsonify(domains)


@app.route('/ids/', methods=['GET'])
def ids():
    query = "SELECT * FROM top500 ORDER BY ID ASC"
    db = database_playground.connect_db_top500()
    return jsonify(generic_sql_query(query, db))


@app.route('/ids/<id>', methods=['GET'])
def id(id):
    query = f"SELECT Website FROM top500 where ID = \"{id}\" ORDER BY ID ASC"
    db = database_playground.connect_db_top500()
    return jsonify(generic_sql_query(query, db))


@app.route('/urls/', methods=['GET'])
def urls():
    query = "SELECT site, category FROM sites_data ORDER BY site ASC"
    db = database_playground.connect_db()
    return jsonify(generic_sql_query(query, db))


#  return render_template("list.html", rows=rows)


@app.route('/urls/<url>', methods=['GET'])
def url(url):
    query = f"SELECT site, category, cookies, requests_tracking FROM sites_data WHERE site = \"{url}\" ORDER BY site ASC"
    db = database_playground.connect_db()
    return jsonify(generic_sql_query(query, db))


@app.route('/tracker/<url>', methods=['GET'])  #
def trackers_category_from_url(url):
    query = f"SELECT categories.name, sites_trackers_data.site AS has_this_tracker,trackers.name, trackers.website_url FROM trackers, categories, sites_trackers_data WHERE trackers.category_id = categories.id AND trackers.id = sites_trackers_data.tracker  AND sites_trackers_data.site =\"{url}\""
    db = database_playground.connect_db()
    return jsonify(generic_sql_query(query, db))


#  return render_template("list.html", rows=rows)


if __name__ == '__main__':
    #db.create_all()
    app.run(debug=True)
