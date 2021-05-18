from os import name
from flask import Flask, render_template, jsonify, request, redirect, url_for
import database_playground 
from flask_cors import CORS  # import with me with the following cmd: pip install flask-cors --upgrade
import re
import json
from interpret_whotracksme import generic_sql_query, calc_label
import sqlite3

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import csv



app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///datenbank.db'
db = SQLAlchemy(app)

class website(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    domain = db.Column(db.String, nullable = False)
    rating = db.Column(db.Integer)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Task %r>' % self.id

@app.route('/datenbank') # Datenbank ausgeben
def index():
    new_domain = website(domain = "manjak")
    # return redirect('/alii')
    # #return "hat nicht geklappt"
    db.session.add(new_domain)
    db.session.commit()
    #con = db.session.cursor()
    #con.execute("SELECT * from website")
    session = db.session()
    cursor = session.execute("SELECT * from website order by date_created desc").cursor
    rows = cursor.fetchall()
    return jsonify(rows)

    #return db.engine.execute('select * from website')

    #return("hat geklappt")

# @app.route('/alii')
# def func():

#     query = "SELECT * FROM "
#     return jsonify(generic_sql_query(query))


@app.route('/')
def hello_world():
    return "Hello CODE"




@app.route('/s')
def calc_labels():
    # label calculation
    return "test"




@app.route('/sendurls/', methods=['POST'])
def receive_urls():
    urls = str(request.data)
    if urls.__contains__("http://"):
        print("unsafe web protocol found")
    urls = urls.split("https://")
    urls.pop(0)
    domains = []
    for e in urls:
        if (e.__contains__("www.")) or e.__contains__("de.") or e.__contains__("shop."):
            e = e.replace('www.', '').replace('de.', '').replace('shop.', '')
        domains.append(e.split("/")[0])
    domains = list(dict.fromkeys(domains))

    print(domains)
    print(len(domains), "domains")


    a = calc_label(domains)
    return jsonify(a)


@app.route('/ids/', methods=['GET'])
def ids():
    query = "SELECT * FROM top500 ORDER BY ID ASC"
    return jsonify(generic_sql_query(query))

@app.route('/ids/<id>', methods=['GET'])
def id(id):
    query = f"SELECT Website FROM top500 where ID = \"{id}\" ORDER BY ID ASC"
    return jsonify(generic_sql_query(query))


@app.route('/urls/', methods=['GET'])
def urls():
    query = "SELECT site, category FROM sites_data ORDER BY site ASC"
    return jsonify(generic_sql_query(query))


#  return render_template("list.html", rows=rows)


@app.route('/urls/<url>', methods=['GET'])
def url(url):
    query = f"SELECT site, category, cookies, requests_tracking FROM sites_data WHERE site = \"{url}\" ORDER BY site ASC"
    return jsonify(generic_sql_query(query))


@app.route('/tracker/<url>', methods=['GET']) #
def trackers_category_from_url(url):
    query = f"  SELECT categories.name, sites_trackers_data.site AS has_this_tracker,trackers.name, trackers.website_url FROM trackers, categories, sites_trackers_data WHERE trackers.category_id = categories.id AND trackers.id = sites_trackers_data.tracker  AND sites_trackers_data.site =\"{url}\""
    return jsonify(generic_sql_query(query))

#  return render_template("list.html", rows=rows)


if __name__ == '__main__':
    db.create_all()
    ## hier werden die top 50 deutschen Websiten hinzugefügt
    with open('top50websites.csv','r') as csv_file:
        csv_reader = csv.reader(csv_file)

        for line in csv_reader:
            if(line[2] != "Adult"):
                r = (line[1].split('.')[0])
                new_domain = website(domain = r)
                db.session.add(new_domain)
                db.session.commit()
    
    print("wurde hinzugefügt")

    app.run(debug=True)


    