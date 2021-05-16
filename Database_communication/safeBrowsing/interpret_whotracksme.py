from flask import jsonify
from safeBrowsing import database_playground
import json

#from safeBrowsing import top500_db_connection



def generic_sql_query(query):
    db = database_playground.connect_db()
    con = db.cursor()

    con.execute(query)
    rows = con.fetchall()
    return rows

"""idea: Each time we find out some bad information about a domain this domain gets points(ofc relatively to the 
information we found out) At the end we check the score of each domain and give the domains a fitting label """


def calc_label(domain_list):
    domain_dict = {}
    for domain in domain_list:
        domain_dict[domain] = whotracksme_score(domain)

    return json.dumps(domain_dict)



def whotracksme_score(domain):
    query = f"  SELECT categories.name, sites_trackers_data.site AS has_this_tracker,trackers.name, trackers.website_url FROM trackers, categories, sites_trackers_data WHERE trackers.category_id = categories.id AND trackers.id = sites_trackers_data.tracker  AND sites_trackers_data.site =\"{domain}\""
    trackers = generic_sql_query(query)
    print(len(trackers), "trackers/ cookies")
    for cookie in trackers:
        print(cookie)
        if(cookie.__contains__("Facebook")):
            return 3;
        return 1;

    return 0;


