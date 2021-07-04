import json
from flask import Flask, jsonify, request
import database_playground
from flask_mysqldb import MySQL
from flask_cors import CORS  # import with me with the following cmd: pip install flask-cors --upgrade
import os
from dotenv import load_dotenv
load_dotenv()
from interpret_whotracksme import generic_sql_query, calc_label, get_domain_by_url, preferences, backend_main, \
expert_mode



app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///datenbank.db'
app.config['MYSQL_HOST'] = os.environ.get('CLOUD_SQL_HOST')
app.config['MYSQL_USER'] = os.environ.get('CLOUD_SQL_USERNAME')
app.config['MYSQL_PASSWORD'] = os.environ.get('CLOUD_SQL_PASSWORD')
app.config['MYSQL_DB'] = os.environ.get('CLOUD_SQL_DATABASE_NAME')
mysql = MySQL(app)


@app.route('/sendurls/', methods=['POST'])
def receive_urls():
    hardcoded_user_preference = ["pornvertising"]
    input = str(request.data)
    print(input)
    split_input = input.split("SPLITME")
    urls = split_input[0]
    pref_input = split_input[1]
    expert_input = split_input[2]
    global expert_mode, preferences
    if expert_input[:-1] == "true":  # without last elem of string as this is just "'"
        expert_mode = True
    else:
        expert_mode = False
    print(preferences)
    preferences = json.loads(pref_input)
    print(expert_mode)
    if urls.__contains__("http://"):
        print("unsafe web protocol found")
    urls = urls.split("https://")
    urls.pop(0)
    ###
    # full_urls = collect_full_urls(urls)
    ###
    domains = []
    for url in urls:
        domains.append(get_domain_by_url(url))
    domains = list(dict.fromkeys(domains))

    domains = backend_main(domains)

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


if __name__ == '__main__':
    app.run(debug=True)
