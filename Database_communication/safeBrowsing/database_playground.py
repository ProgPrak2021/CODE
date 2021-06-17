import sqlite3


def connect_db():
    return sqlite3.connect('whotracksme.db')


def connect_db_top500():
    return sqlite3.connect('top500webpages.db')


def connect_db_labels():
    return sqlite3.connect('labels.db')

def connect_phishcore_db():
    return sqlite3.connect('phishstats.db')

def connect_new_labels():
    return sqlite3.connect('newlabels.db')

