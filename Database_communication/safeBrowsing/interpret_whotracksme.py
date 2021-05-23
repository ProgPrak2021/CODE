import requests
from flask import jsonify
from safeBrowsing import database_playground
import json


# from safeBrowsing import top500_db_connection


def generic_sql_query(query):
    db = database_playground.connect_db()
    con = db.cursor()

    con.execute(query)
    rows = con.fetchall()
    return rows


"""idea: Each time we find out some bad information about a domain this domain gets points(ofc relatively to the 
information we found out) At the end we check the score of each domain and give the domains a fitting label """


# all domains are now standardized (no prefix whatsoever)
def get_domain_by_url(url):
    if url.__contains__("www."):
        url = url.replace('www.', '')
    url = url.split("/")[0]
    url_split = url.split(".")
    if len(url_split) >= 3:
        url_split.pop(0)
    url = ".".join(url_split)
    return url


def calc_label(domain_list):
    domain_dict = {}
    print(domain_list, "were here")
    for domain in domain_list:
        domain_dict[domain] = whotracksme_score(domain) + phishstats_score(domain)
        google_safe_browsing_score(domain)
    return json.dumps(domain_dict)


def whotracksme_score(domain):
    query = f"  SELECT categories.name, sites_trackers_data.site AS has_this_tracker,trackers.name, trackers.website_url FROM trackers, categories, sites_trackers_data WHERE trackers.category_id = categories.id AND trackers.id = sites_trackers_data.tracker  AND sites_trackers_data.site =\"{domain}\""
    trackers = generic_sql_query(query)
    print(domain, "\t", len(trackers), "trackers")
    # print(trackers)

    index = 0
    for cookie in trackers:
        if cookie.__contains__("Facebook"):
            print("3")
            return 3
        elif len(trackers) > 0:
            # TODO: yet to be implemented
            print("1")
            index = 1
        else:
            # TODO: yet to be implemented
            print("2")
            index = 2

    return index  # ... = 0
    # bedeutet: domain ist in keiner Datenbank enthalten


def api_call(request, payload, body, type):
    if type == "POST":
        response = requests.post(request, data=payload, json=body)
    elif type == "GET":
        response = requests.get(request)
    return response.json()


my_api_key = ""


def phishstats_score(domain):  # unfortunately this api is fucking slow      #lelel
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
    response = api_call(f" https://safebrowsing.googleapis.com/v4/threatMatches:find?key={my_api_key}", None, body,
                        "POST")
