import json

from flask import Flask, jsonify, request, make_response
import database_playground
from flask_cors import CORS  # import with me with the following cmd: pip install flask-cors --upgrade
from interpret_whotracksme import generic_sql_query, calc_label, get_domain_by_url, backend_main, change_prefs, \
    change_expert

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///datenbank.db'


@app.route('/sendurls/', methods=['POST'])
def receive_urls():
    default_preferences = {"whotracksme": ['FacebookWTM', 'AmazonWTM'], "privacyspy": [], "google_safeBrowsing": [],
                           "phishstats": [],
                           "tosdr": [],
                           "Tilthub": []}
    input = request.json

    #failure handling
    if input["urls"] is None:
        resp = make_response("No urls", 400)
        return resp
    if input["preferences"] is None:
        resp = make_response("No preferences", 400)
        return resp
    if input["expert"] is None:
        resp = make_response("No expert", 400)
        return resp

    #apply given input
    if input["expert"]:
        change_expert(True)
    else:
        change_expert(False)
    if "no Preferences" in input["preferences"]:
        print(input["preferences"])
    else:
        print(input["preferences"])
        change_prefs(json.loads(input["preferences"]))
    if input["urls"].__contains__("http://"):
        print("unsafe web protocol found")

    urls = input["urls"].split("https://")
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
