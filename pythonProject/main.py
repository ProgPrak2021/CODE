# This is a sample Python script.

# Press Umschalt+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

import requests
import sqlite3
import json


def read_db():
    db = sqlite3.connect('top500webpages.db')
    query = "SELECT Website FROM top500;"
    cursor = db.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    return rows



# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    rows = read_db()
    sendMe = ""
    for i in range(10):
        for i in range(0,50):
            print(i)
            sendMe += rows[i][0] + " "
            rows.remove(rows[i])
        requests.post("http://127.0.0.1:5000/sendurls/",
                      json={"urls": sendMe, "preferences": {"no information": "yes"}, "expert": False})
        sendMe = "";

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
