from flask import Flask, render_template, jsonify, request
import database_playground
from flask_cors import CORS  # import with me with the following cmd: pip install flask-cors --upgrade
import re

from safeBrowsing.interpret_whotracksme import generic_sql_query

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():
    # label calculation

    return "Hello CODE"


@app.route('/sendurls/', methods=['POST'])
def receive_urls():
    urls = str(request.data)
    list = re.split(r'.(?=http)', urls)
    list.pop(0)
    print(list)
    return "HJH"


@app.route('/urls/', methods=['GET'])
def urls():
    query = "SELECT site, category FROM sites_data ORDER BY site ASC"
    return generic_sql_query(query)


#  return render_template("list.html", rows=rows)


@app.route('/urls/<url>', methods=['GET'])
def url(url):
    query = f"SELECT site, category, cookies, requests_tracking FROM sites_data WHERE site = \"{url}\" ORDER BY site ASC"
    return generic_sql_query(query)


@app.route('/tracker/<url>', methods=['GET']) #
def trackers_category_from_url(url):
    query = f"  SELECT categories.name, sites_trackers_data.site AS has_this_tracker,trackers.name, trackers.website_url FROM trackers, categories, sites_trackers_data WHERE trackers.category_id = categories.id AND trackers.id = sites_trackers_data.tracker  AND sites_trackers_data.site =\"{url}\""
    return generic_sql_query(query)


#  return render_template("list.html", rows=rows)


if __name__ == '__main__':
    app.run(debug=True)
