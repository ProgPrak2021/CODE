import requests
from flask import jsonify
import database_playground
import json
from pprint import pprint
from dotenv import dotenv_values


# from safeBrowsing import top500_db_connection

def fill_label_database(domain_dict, users):
    db = database_playground.connect_db_labels()
    # print(domain_dict)
    for key in domain_dict:
        # print(key)
        query = f"REPLACE INTO domain_data (domain, label, users) VALUES (\"{key}\", \"{domain_dict[key]}\", \"{users}\");"
        cursor = db.cursor()
        cursor.execute(query)
        db.commit()


def generic_sql_query(query, db):
    cursor = db.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    return rows


"""idea: Each time we find out some bad information about a domain this domain gets points(ofc relatively to the 
information we found out) At the end we check the score of each domain and give the domains a fitting label """


def get_domain_by_url(url):
    if url.__contains__("www."):
        url = url.replace('www.', '')
    url = url.split("/")[0]
    url_split = url.split(".")
    if len(url_split) >= 3:
        url_split.pop(0)
    url = ".".join(url_split)
    return url


def build_user_linking_string(unwanted_categroies):
    unwanted_categroies.sort()
    db_string = ""
    for category in unwanted_categroies:
        db_string += str(category)
    return db_string


def calc_label(domain_list, unwanted_categories):
    # global config
    # config = dotenv_values(".env")  # take environment variables from .env.
    domain_dict = {}
    print(domain_list, "were here")
    db = database_playground.connect_db_labels()
    data_summary = {}
    db_string = build_user_linking_string(unwanted_categories)

    for domain in domain_list:
        query = f"SELECT label FROM domain_data WHERE domain=\"{domain}\";"
        labels = None  # generic_sql_query(query, db)

        if not labels:

            # TODO: CREATE JSON DATA SUMMARY FROM ALL SOURCES --> APPEND INFORMATION PACKAGE(json list) TO KEY(domain)
            data_summary[domain] = whotracksme_score(domain, unwanted_categories)  # , tester_db(), tester_api()

            domain_dict[domain] = data_summary[domain]["whotracksme.db"]["label"]
            # domain_dict[domain] = score        # + phishstats_score(domain)
            # if you have configured api keys from google and rapid and have stored the keys in textfile called .env you can use the line below and the first two lines in this function. If you not you should comment it to avoid errors
            # domain_dict[domain] += google_safe_browsing_score(domain) + web_risk_api_score(domain)
        else:
            domain_dict[domain] = labels[0][0]
    fill_label_database(domain_dict, db_string)

    print(data_summary)
    return json.dumps(data_summary)  # json.dumps(domain_dict)


def tester_db():
    tester = {"PRIVACY": {}}
    tester["PRIVACY"]['VALUE'] = '9999'
    tester["PRIVACY"]['xxxx'] = 'yyyy'
    return tester


def tester_api():
    tester = {"INFORMATION": {}}
    tester["INFORMATION"]['VALUE'] = '1234'
    tester["INFORMATION"]['pppp'] = 'xxxx'
    return tester


def whotracksme_score(domain, unwanted_categories):
    query = f"  SELECT categories.name, sites_trackers_data.site AS has_this_tracker,trackers.name, trackers.website_url FROM trackers, categories, sites_trackers_data WHERE trackers.category_id = categories.id AND trackers.id = sites_trackers_data.tracker  AND sites_trackers_data.site =\"{domain}\""
    db = database_playground.connect_db()
    trackers = generic_sql_query(query, db)
    # print(domain, "\t", len(trackers), "trackers")
    # print(trackers)

    # TODO: CREATE WHOTRACKME.db DATA SUMMARY (information package)
    data_summary = {'whotracksme.db': {}}

    index = 0
    facebook = False
    for cookie in trackers:
        for category in unwanted_categories:
            if cookie.__contains__(category):
                index += 2
        if cookie.__contains__("Facebook"):
            index += 0.5
            facebook = False
    cookie_len = len(list(filter(lambda a: not a.__contains__("essential"), trackers)))
    index += cookie_len * 0.1
    if index > 3:
        index = 3
    index.__round__()

    data_summary['whotracksme.db']['label'] = eval(str(index))
    data_summary['whotracksme.db']['tracker'] = eval(str(len(trackers)))
    data_summary['whotracksme.db']['facebook'] = eval(str(facebook))

    # print(data_summary)

    return data_summary  # index  # ... = 0
    # bedeutet: domain ist in keiner Datenbank enthalten


def privacyspy_score(domain):
    req = requests.get(
        "https://privacyspy.org/api/v2/index.json")  ### statt online jedes mal aurufen  besser lokal json speichern !
    response = req.json()
    for item in response:
        if (domain.upper() in item['name'].upper()):
            return item['score']
    return 0


def api_call(request, payload, body, type):
    if type == "POST":
        response = requests.post(request, data=payload, json=body)
    elif type == "GET":
        response = requests.get(request)
    return response.json()


def phishstats_score(domain):  # unfortunately this api is fucking slow
    print("test")
    response = api_call(f"https://phishstats.info:2096/api/phishing?_where=(url,like,~{domain}~)", None, None, "GET")
    print(response)
    for object in response:
        if get_domain_by_url(object["url"]) == domain:
            print(f"domain: {domain} is bad.")
            return 1
    return 0


def google_safe_browsing_score(domain):
    body = {
        "client": {
            "clientId": "ProgPrak",
            "clientVersion": "141"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
            "platformTypes": ["WINDOWS"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [
                {
                    "url": f"{domain}"},
            ]
        }
    }
    response = api_call(f" https://safebrowsing.googleapis.com/v4/threatMatches:find?key={config['GOOGLE_API_KEY']}",
                        None, body,
                        "POST")
    return 0


def web_risk_api_score(domain):
    url = "https://wot-web-risk-and-safe-browsing.p.rapidapi.com/targets"

    querystring = {"t": domain}

    headers = {
        'x-rapidapi-key': config["RAPID_API_KEY"],
        'x-rapidapi-host': "wot-web-risk-and-safe-browsing.p.rapidapi.com"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    print(response.json())
    return 0
