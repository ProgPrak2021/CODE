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


def get_domain_by_url(url):
    if (url.__contains__("www.")) or url.__contains__("de.") or url.__contains__("shop."):
        url = url.replace('www.', '').replace('de.', '').replace('shop.', '')
    return url.split("/")[0]


def calc_label(domain_list):
    domain_dict = {}
    print(domain_list)
    for domain in domain_list:
        domain_dict[domain] = whotracksme_score(domain) #+ phishstats_score(domain)
        google_safe_browsing_score(domain)
    return json.dumps(domain_dict)


def whotracksme_score(domain):
    query = f"  SELECT categories.name, sites_trackers_data.site AS has_this_tracker,trackers.name, trackers.website_url FROM trackers, categories, sites_trackers_data WHERE trackers.category_id = categories.id AND trackers.id = sites_trackers_data.tracker  AND sites_trackers_data.site =\"{domain}\""
    trackers = generic_sql_query(query)
    # print(len(trackers), "trackers/ cookies")
    for cookie in trackers:
        # print(cookie)
        if (cookie.__contains__("Facebook")):
            return 3
        # return 1
    return 1


def api_call(request, payload, body, type):
    if type == "POST":
        response = requests.post(request, data=payload, json=body)
    elif type == "GET":
        response = requests.get(request)
    return response.json()


my_api_key = ""


def phishstats_score(domain): # unfortunately this api is fucking slow
    print("test")
    response = api_call(f"https://phishstats.info:2096/api/phishing?_where=(url,like,~{domain}~)", None, None, "GET")
    print(len(response))
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
