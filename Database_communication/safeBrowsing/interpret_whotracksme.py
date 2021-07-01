import requests
from flask import jsonify, config
import database_playground
import json
from pprint import pprint
import ast

preferences = {"whotracksme": ['Facebook', 'Amazon'], "privacyspy": [], "google_safeBrowsing": [], "phishstats": [],
               "webrisk": []}
expert_mode = True


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


def backend_main(domain_list):

    unwanted_categories = []  # just temporary
    # global config
    # config = dotenv_values(".env")  # take environment variables from .env.
    domain_dict = {}
    db = database_playground.connect_db_labels()
    data_summary = {}
    db_string = build_user_linking_string(unwanted_categories)

    newlabelsdb = database_playground.connect_new_labels()

    for domain in domain_list:



        query = f"SELECT domain FROM dict where domain = '{domain}';"
        doma = generic_sql_query(query, newlabelsdb)
        data_summary[domain] = []

        if doma:
            query = f"SELECT name FROM columns;"
            columns = generic_sql_query(query, newlabelsdb)
            cnt = columns.__len__()
            for i in range(cnt):
                col = columns[i]

                query = f"SELECT {col[0]} FROM dict where domain = '{domain}';"

                partialDict = generic_sql_query(query, newlabelsdb)
                strDict = (partialDict[0])[0]
                newDict = json.loads(strDict)
                data_summary[domain].append(newDict)

        if not data_summary[domain]:
            # TODO. ACTUALLY CALCUTALTE THE LABEL
            label_max = 3
            if expert_mode:
                label_max = 9

            calced_label = calc_label(label_max,
                                      [whotracksme_score(domain, unwanted_categories), phishstats_score(domain)])  # ,
            # privacyspy_score(domain)])  # , google_safe_browsing_score(domain)])

            # TODO. CREATE JSON DATA SUMMARY (INFORMATION PACKAGE)

            dictionary = {'label': calced_label}, {'expert': expert_mode}, whotracksme_score(domain,
                                                                                             unwanted_categories), phishstats_score(
                domain), privacyspy_score(domain)  # , google_safe_browsing_score(domain)

            tilthubScore(domain)
            data_summary[domain] = dictionary

            saveCalcLabels(dictionary, domain, calced_label)

            # domain_dict[domain] = data_summary[domain][0]["whotracksme.db"]["label"]
            # domain_dict[domain] = score        # + phishstats_score(domain)
            # if you have configured api keys from google and rapid and have stored the keys in textfile called .env you can use the line below and the first two lines in this function. If you not you should comment it to avoid errors
            # domain_dict[domain] += int(phishstats_score(domain)["phishstats.db"]["label"])
            # domain_dict[domain] += google_safe_browsing_score(domain) + web_risk_api_score(domain)

    pprint(data_summary)
    dumpDatasum = json.dumps(data_summary)
    return dumpDatasum  # json.dumps(domain_dict)



def tilthubScore(domain):

    split = domain.split(".")
    name = split[0]

    response = api_call("http://34.89.190.55:5000/api/task/", None, None, "GET")

    data_summary = {
        'tilthub': {
            'score': '0',
            'Data Disclosed': '',
            'Third Country Transfers': '',
            'Right to Withdraw Consent': '',
            'Right to Complain': '',
            'Right to Deletion': '',
            'Changes of Purpose': '',
        }}


    length = len(response)
    for i in range(length):
        if response[i]['name'] == name:

            break


    return


def saveCalcLabels(data_summary, domain, label):
    db = database_playground.connect_new_labels()
    # print(domain_dict)

    lenList = data_summary.__len__()

    for i in range(lenList):
        dict = data_summary[i]

        dictString = json.dumps(dict)

        start = dictString.find('"') + 1
        end = dictString.find('"', start)
        key = dictString[start:end]
        if (key[-3:] == '.db'):
            key = dictString[start:end - 3]

        query = f"INSERT INTO dict (domain) SELECT '{domain}' WHERE NOT EXISTS (SELECT domain FROM dict WHERE domain = '{domain}');"
        cursor = db.cursor()
        cursor.execute(query)
        db.commit()

        query = f"INSERT INTO columns (name) SELECT '{key}' WHERE NOT EXISTS (SELECT name FROM columns WHERE name = '{key}');"
        cursor = db.cursor()
        cursor.execute(query)
        db.commit()

        try:

            query = f"ALTER TABLE dict ADD \"{key}\" varchar(999);"
            cursor = db.cursor()
            cursor.execute(query)
            db.commit()

            query = f"update dict set {key} = '{dictString}' where domain = '{domain}';"

            cursor = db.cursor()
            cursor.execute(query)
            db.commit()

        except:

            # query = f"replace INTO dict ({key}) VALUES ('{dictString}');"
            query = f"update dict set {key} = '{dictString}' where domain = '{domain}';"

            cursor = db.cursor()
            cursor.execute(query)
            db.commit()
            continue

    """whotracksme_label = data_summary[0]["whotracksme.db"]["score"]
    tracker_cnt = data_summary[0]["whotracksme.db"]["tracker_count"]
    amzn = data_summary[0]["whotracksme.db"]["amazon"]
    fcbook = data_summary[0]["whotracksme.db"]["facebook"]


    phishstats_label = data_summary[1]["phishstats.db"]["score"]
    phishing_category = data_summary[1]["phishstats.db"]["category"]

    privacyspy_score = str(data_summary[2]["privacyspy"]["score"])"""

    """query = f"REPLACE INTO labels (domain, calced_label, whotracksme_score, tracker_count, amazon, facebook, phishstats_score, phishing_category, privacyspy_score) VALUES (\"{domain}\", \"{label}\" , \"{whotracksme_label}\", \"{tracker_cnt}\", \"{fcbook}\", \"{amzn}\", \"{phishstats_label}\", \"{phishing_category}\" , \"{privacyspy_score}\");"
    cursor = db.cursor()
    cursor.execute(query)
    db.commit()"""


def calc_label(label_max, db_array):
    res = 0
    no_data = 0
    for db in db_array:
        res += int(list(db.values())[0]['score'])
        if int(list(db.values())[0]['score']) == 0:
            no_data += 1
    if res == 0:
        return 0
    res = res / (len(db_array) - no_data)
    if res > label_max:
        res = label_max
    if res != 0 and res.__round__() == 0:
        res = 1
    else:
        res = res.__round__()
    # print(res)
    return res


def whotracksme_score(domain, unwanted_categories):
    # print(preferences)
    query_trackers = f"SELECT sites_trackers_data.tracker AS tracker, categories.name AS category, companies.name AS Company_name, https FROM trackers, categories, sites_trackers_data, companies WHERE trackers.category_id = categories.id AND trackers.company_id = companies.id AND trackers.id = sites_trackers_data.tracker AND sites_trackers_data.site =\"{domain}\""
    db = database_playground.connect_db()
    trackers = generic_sql_query(query_trackers, db)

    # TODO: CREATE WHOTRACKSME.db DATA SUMMARY (information package)
    data_summary = {
        'whotracksme.db': {
            'score': '0',
            'tracker_count': '0',
            'facebook': '',
            'amazon': '',
            'trackers': []
        }}
    if preferences["whotracksme"]:
        if "disable" in preferences["whotracksme"]:
            return data_summary
    max_index = 3
    expert_weight = 1
    if expert_mode:
        expert_weight = 2.5  # multiplier for the expert mode
        max_index = 9
    facebook_amazon_weight = 0.5 * expert_weight
    category_weight = 2 * expert_weight
    https_weight = 1.5 * expert_weight
    tracker_multiplier_weight = 0.1 * expert_weight
    https_avg = 0
    index = 0
    facebook = False
    amazon = False
    https_all_tracker = 0
    for cookie in trackers:
        print(cookie[3])
        for category in unwanted_categories:
            if cookie in category:
                index += category_weight
        # if preferences["whotracksme"]:
        if "Facebook" in preferences["whotracksme"] and cookie.__contains__("Facebook"):
            index += facebook_amazon_weight
            facebook = True
        if "Amazon" in preferences["whotracksme"] and cookie.__contains__("Amazon"):
            index += facebook_amazon_weight
            amazon = True
        https_all_tracker += cookie[3]
    if trackers:
        https_avg = https_all_tracker / len(trackers)
        if https_avg < 0.7:  # means that less than 70 percent of the domains tracker use the https protocoll
            index += https_weight

    # if preferences["whotracksme"]:
    if "weight_tracker" in preferences["whotracksme"]:
        tracker_multiplier_weight = tracker_multiplier_weight * 2

    cookie_len = len(list(filter(lambda a: not a.__contains__("essential"), trackers)))
    index += cookie_len * tracker_multiplier_weight

    if index > max_index:
        index = max_index
    if index != 0 and index.__round__() == 0:
        index = 1
    index = index.__round__()

    for i in trackers:
        data_summary['whotracksme.db']['trackers'] += [{  # Fill trackers array
            'name': i[0],
            'category': i[1],
            'company': i[2],
        }]

    data_summary['whotracksme.db']['score'] = eval(str(index))
    data_summary['whotracksme.db']['tracker_count'] = eval(str(len(trackers)))
    data_summary['whotracksme.db']['facebook'] = eval(str(facebook))
    data_summary['whotracksme.db']['amazon'] = eval(str(amazon))
    data_summary['whotracksme.db']['https_avg'] = eval(str(https_avg))

    return data_summary

# new database tosdr:https://tosdr.org/
def tosdr_score(domain):
    with open('tosdr.json', encoding="utf8") as file:
        data = json.load(file)
    for elem in data['parameters']['services']:
        print(elem['name'])


def privacyspy_score(domain):
    data_summary = {
        'privacyspy': {
            'score': '0',
            'name': '',

            'link': ''

        }}

    with open('privacyspy.json', encoding="utf8") as file:
        data = json.load(file)
    for elem in data:
        if domain in elem['hostnames']:
            print(domain + " and score: " + str(elem['score']))
            data_summary['privacyspy']['score'] = ((elem['score'] - 10) * - 1) / 3
            data_summary['privacyspy']['name'] = elem['name']
            data_summary['privacyspy']['link'] = 'https://privacyspy.org/product/' + str(elem['slug'])

            # data_summary['privacyspy']['rubric'] = https://privacyspy.org/product/

    return data_summary


def api_call(request, payload, body, type):
    if type == "POST":
        response = requests.post(request, data=payload, json=body)
    elif type == "GET":
        response = requests.get(request)
    return response.json()


def phishstats_score(domain):  # unfortunately this api is fucking slow

    query = f"SELECT score, url from phish_score where URL like '%{domain}%'"
    db = database_playground.connect_phishcore_db()
    req = generic_sql_query(query, db)
    data_summary = {
        'phishstats.db': {
            'score': '0',
            'category': 'no phishing',
            'phishing': 'false'
        }}

    if not req:
        return data_summary

    length = req.__len__()
    domainPresent = False

    for i in range(length):

        url = (req[i][1]).split("//")[1]
        comparison = get_domain_by_url(url)
        if domain == comparison:
            domainPresent = True
            break

    if not domainPresent:
        return data_summary

    score = req[i][0]

    num = float(score.replace("\"", ""))

    if num <= 2:
        data_summary['phishstats.db']['score'] = eval(str(2))
        data_summary['phishstats.db']['category'] = "possibly phishing"

    elif num <= 4 and num > 2:
        data_summary['phishstats.db']['score'] = eval(str(2))
        data_summary['phishstats.db']['category'] = "sus"

    elif num <= 6 and num > 4:
        data_summary['phishstats.db']['score'] = eval(str(3))
        data_summary['phishstats.db']['category'] = "probably phishing"

    else:
        data_summary['phishstats.db']['score'] = eval(str(3))
        data_summary['phishstats.db']['category'] = "guaranteed phishing"
        data_summary['phishstats.db']['phishing'] = "True"


    if expert_mode:
        data_summary['phishstats.db']['score'] = eval(str(num))

    return data_summary


def google_safe_browsing_score(domain):
    data_summary = {
        'safe_browsing_api': {
            'score': '0',
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
        data_summary['safe_browsing_api.db']['score'] = 3
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
