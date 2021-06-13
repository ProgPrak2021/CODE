import requests
from flask import jsonify, config
import database_playground
import json
from pprint import pprint


preferences = {"whotracksme": [], "privacyspy": [], "google_safeBrowsing": [], "phishstats": [], "webrisk": []}


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


def dict_to_String(dict):
    end_string = ""
    for key in dict:
        if dict[key]:
            dict[key] = dict[key].sort()
            end_string += key + str(dict[key])


def calc_label(domain_list):
    unwanted_categories = []  # just temporary
    # global config
    # config = dotenv_values(".env")  # take environment variables from .env.
    domain_dict = {}
    # print(domain_list, "were here")
    db = database_playground.connect_db_labels()
    data_summary = {}
    db_string = build_user_linking_string(unwanted_categories)

    for domain in domain_list:
        #query = f"SELECT label FROM domain_data WHERE domain=\"{domain}\" AND user_linking = \"{dict_to_String(preferences)}\";"
        labels = None  # generic_sql_query(query, db)

        if not labels:

            # TODO: CREATE JSON DATA SUMMARY FROM ALL SOURCES --> APPEND INFORMATION PACKAGE(json list) TO KEY(domain)
            data_summary[domain] = whotracksme_score(domain, unwanted_categories), phishstats_score(domain) #, tester_db(), tester_api()


            domain_dict[domain] = data_summary[domain][0]["whotracksme.db"]["label"]
            # domain_dict[domain] = score        # + phishstats_score(domain)
            # if you have configured api keys from google and rapid and have stored the keys in textfile called .env you can use the line below and the first two lines in this function. If you not you should comment it to avoid errors
            domain_dict[domain] += int(phishstats_score(domain)["phishstats.db"]["label"])
            # domain_dict[domain] += google_safe_browsing_score(domain) + web_risk_api_score(domain)
        else:
            domain_dict[domain] = labels[0][0]

    #fill_label_database(domain_dict, db_string) bekomme hier einen fehler :/

    pprint(data_summary)
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
    print(preferences)
    query_trackers = f"SELECT sites_trackers_data.tracker AS tracker, categories.name AS category, companies.name AS Company_name FROM trackers, categories, sites_trackers_data, companies WHERE trackers.category_id = categories.id AND trackers.company_id = companies.id AND trackers.id = sites_trackers_data.tracker AND sites_trackers_data.site =\"{domain}\""

    db = database_playground.connect_db()
    trackers = generic_sql_query(query_trackers, db)

    # TODO: CREATE WHOTRACKSME.db DATA SUMMARY (information package)
    data_summary = {
        'whotracksme.db': {
            'label': '0',
            'tracker_count': '0',
            'facebook': '',
            'amazon': '',
            'trackers': []
        }}
    if preferences["whotracksme"]:
        if "disable" in preferences["whotracksme"]:
            return data_summary

    index = 0
    facebook = False
    amazon = False
    for cookie in trackers:
        for category in unwanted_categories:
            if cookie in (category):
                index += 2
            if preferences["whotracksme"]:
                if "Facebook" in preferences["whotracksme"] and cookie.__contains__("Facebook"):
                    index += 0.5
                    facebook = True
                if "Amazon" in preferences["whotracksme"] and cookie.__contains__("Amazon"):
                    index += 0.5
                    amazon = True
    tracker_weight_multiplier = 0.1
    if preferences["whotracksme"]:
        if "weight_tracker" in preferences["whotracksme"]:
            tracker_weight_multiplier = 0.2
    cookie_len = len(list(filter(lambda a: not a.__contains__("essential"), trackers)))
    index += cookie_len * tracker_weight_multiplier
    if index > 3:
        index = 3

    if index != 0 and index.__round__() == 0:
        index = 1

    index = index.__round__()

    for i in trackers:
        data_summary['whotracksme.db']['trackers'] += [{  # Fill trackers array
            'name': i[0],
            'category': i[1],
            'company': i[2]
        }]
    data_summary['whotracksme.db']['label'] = eval(str(index))
    data_summary['whotracksme.db']['tracker_count'] = eval(str(len(trackers)))
    data_summary['whotracksme.db']['facebook'] = eval(str(facebook))
    data_summary['whotracksme.db']['amazon'] = eval(str(amazon))

    return data_summary


def privacyspy_score(domain):
    data_summary = {
        'privacyspy': {
            'score': '0'
        }}
    ### Wenn die Domain nicht in der privacyspy auftaucht dann ist der score 0

    f = open('privacyspy.json')
    data = json.load(f)
    for item in data:
        if (domain.upper() in item['name'].upper()):
            data_summary['privacyspy']['score'] = (round((item['score']) / 3))
            if (data_summary['privacyspy']['score'] == (0)):
                data_summary['privacyspy']['score'] = 1
            return data_summary
    return data_summary


def api_call(request, payload, body, type):
    if type == "POST":
        response = requests.post(request, data=payload, json=body)
    elif type == "GET":
        response = requests.get(request)
    return response.json()


def phishstats_score(domain):  # unfortunately this api is fucking slow

    query = f"SELECT score from phish_score where URL like '%{domain}%'"
    db = database_playground.connect_phishcore_db()
    req = generic_sql_query(query, db)
    data_summary = {
        'phishstats.db': {
            'label': '1',
            'category': 'no phishing',
        }}

    if (req == []):
        return data_summary


    score = req[0][0]

    num = float(score)

    if num <= 2:
        data_summary['phishstats.db']['label'] = eval(str(2))
        data_summary['phishstats.db']['category'] = eval("possibly phishing")

    elif num <= 4:
        data_summary['phishstats.db']['label'] = eval(str(2))
        data_summary['phishstats.db']['category'] = "sus"

    data_summary['phishstats.db']['label'] = eval(str(3))

    if num <= 6:
        data_summary['phishstats.db']['category'] = "probably phishing"

    else:
        data_summary['whotracksme.db']['category'] = eval(str("guranteed phishing"))

    return data_summary




def google_safe_browsing_score(domain):
    data_summary = {
        'safe_browsing_api': {
            'label': '0',
            'threatType': '',
            'platform': '',

        }}
    body = {
        "client": {
            "clientId": "ProgPrak",
            "clientVersion": "141"
        },
        "threatInfo": {
            "threatTypes": ["THREAT_TYPE_UNSPECIFIED", "MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE",
                            "POTENTIALLY_HARMFUL_APPLICATION"],
            "platformTypes": ["WINDOWS", "LINUX", "OSX", "IOS", "CHROME"],
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
    # print(response)
    if response:
        print(response)
        data_summary['safe_browsing_api.db']['label'] = 3
        data_summary['safe_browsing_api.db']['threatType'] = response['matches'][0]['threatType']
        data_summary['safe_browsing_api.db']['platform'] = response['matches'][0]['platformType']

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
