import sqlite3
from flask_mysqldb import MySQL
from flask import current_app as app

mysql = MySQL(app)

def connect_db():
    return sqlite3.connect('db/whotracksme.db')


def connect_db_top500():
    return sqlite3.connect('db/top500webpages.db')


def connect_db_labels():
    return sqlite3.connect('db/labels.db')

def connect_phishcore_db():
    return sqlite3.connect('db/phishstats.db')


def connect_new_labels():
    return mysql.connection





