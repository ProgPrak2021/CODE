from flask import jsonify

from safeBrowsing import database_playground


def generic_sql_query(query):
    db = database_playground.connect_db()
    con = db.cursor()

    con.execute(query)
    rows = con.fetchall()
    return jsonify(rows)
