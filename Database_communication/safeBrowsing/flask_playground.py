from flask import Flask, jsonify, request
import database_playground
from flask_cors import CORS  # import with me with the following cmd: pip install flask-cors --upgrade
from interpret_whotracksme import generic_sql_query, calc_label, get_domain_by_url, preferences


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///datenbank.db'


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
    hardcoded_user_preference = ["pornvertising"]
    urls = str(request.data)
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

    domains = calc_label(domains)

    return jsonify(domains)


@app.route('/sendPref/', methods=['POST'])
def receivePref():
    pref = request.data.decode('UTF-8')
    pref = pref.split("SPLIT")
    print(pref)
    if preferences[pref[0]]:
        if preferences[pref[0]].__contains__(pref[1]):
            preferences[pref[0]].remove(pref[1])
        else:
            preferences[pref[0]].append(pref[1])
            print(preferences)
    else:
        preferences[pref[0]] = [pref[1]]
        print(preferences)

    return ""


# collecting visited urls for statistics
# still working on it
# @author: diana
# @app.route('/collecturls/', methods=['POST'])
# def collect_visited_urls():
#     urls_list = str(request.data)
#     urls_list = urls_list.split("https://")
#     urls_list.pop(0)
#     domains = []
#     for url in urls_list:
#         domains.append(get_domain_by_url(url))
#     domains = list(dict.fromkeys(domains))
#     print(domains)
#     return jsonify(domains)


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
