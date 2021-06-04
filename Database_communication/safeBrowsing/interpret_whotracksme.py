import requests
from flask import jsonify
import database_playground
import json
from dotenv import dotenv_values


# from safeBrowsing import top500_db_connection

def fill_label_database(domain_dict):
    db = database_playground.connect_db_labels()
    # print(domain_dict)
    for key in domain_dict:
        print(key)
        query = f"REPLACE INTO domain_data (domain, label) VALUES (\"{key}\", \"{domain_dict[key]}\"); "
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


def calc_label(domain_list):
    #global config
    #config = dotenv_values(".env")  # take environment variables from .env.
    domain_dict = {}
    print(domain_list, "were here")
    db = database_playground.connect_db_labels()

    for domain in domain_list:
        query = f"SELECT label FROM domain_data WHERE domain=\"{domain}\";"
        labels = generic_sql_query(query, db)

        if not labels:
            value1 = whotracksme_score(domain)
            value2 = privacyspy_score(domain)
            score = 0

            if(value1 > 0 and value2 > 0):
                score = (value1 + value2)/2
            elif(value1 > 0):
                score = value1
            else:
                score = value2

        
            domain_dict[domain] = score  # + phishstats_score(domain)
            # if you have configured api keys from google and rapid and have stored the keys in textfile called .env you can use the line below and the first two lines in this function. If you not you should comment it to avoid errors
            #domain_dict[domain] += google_safe_browsing_score(domain) + web_risk_api_score(domain)
        else:
            domain_dict[domain] = labels[0][0]
    fill_label_database(domain_dict)
    return json.dumps(domain_dict)


def whotracksme_score(domain):
    query = f"  SELECT categories.name, sites_trackers_data.site AS has_this_tracker,trackers.name, trackers.website_url FROM trackers, categories, sites_trackers_data WHERE trackers.category_id = categories.id AND trackers.id = sites_trackers_data.tracker  AND sites_trackers_data.site =\"{domain}\""
    db = database_playground.connect_db()
    trackers = generic_sql_query(query, db)
    print(domain, "\t", len(trackers), "trackers")
    # print(trackers)

    index = 0
    for cookie in trackers:
        if cookie.__contains__("Facebook"):
            return 3
        elif len(trackers) > 0:
            # TODO: yet to be implemented
            index = 1
        else:
            # TODO: yet to be implemented
            index = 2

    return index  # ... = 0
    # bedeutet: domain ist in keiner Datenbank enthalten


def privacyspy_score(domain):
    req = requests.get("https://privacyspy.org/api/v2/index.json") ### statt online jedes mal aurufen  besser lokal json speichern !
    response = req.json()
    for item in response:
        if(domain.upper() in item['name'].upper()):
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
