import sqlite3
from flask_mysqldb import MySQL
import sqlalchemy
import os
from flask import current_app as app


db_config = {
    "pool_size": 5,
    "max_overflow": 2,
    "pool_timeout": 30,  # 30 seconds
    "pool_recycle": 1800,  # 30 minutes
}




def init_unix_connection_engine(db_config):
    
    db_user = os.environ.get('CLOUD_SQL_USERNAME')
    db_pass = os.environ.get('CLOUD_SQL_PASSWORD')
    db_name = os.environ.get('CLOUD_SQL_DATABASE_NAME')
    db_socket_dir = os.environ.get("CLOUD_SOCKET_DIR", "/cloudsql")
    cloud_sql_connection_name = os.environ.get("CLOUD_SQL_CONNECTION_NAME")

    pool = sqlalchemy.create_engine(
        # Equivalent URL:
        # mysql+pymysql://<db_user>:<db_pass>@/<db_name>?unix_socket=<socket_path>/<cloud_sql_instance_name>
        sqlalchemy.engine.url.URL.create(
            drivername="mysql+pymysql",
            username=db_user, 
            password=db_pass, 
            database=db_name,  
            query={
                "unix_socket": "{}/{}".format(
                    db_socket_dir, 
                    cloud_sql_connection_name)  
            }
        ),
        **db_config
    )

    return pool


def connect_db():
    return sqlite3.connect('db/whotracksme.db')


def connect_db_top500():
    return sqlite3.connect('db/top500webpages.db')


def connect_db_labels():
    return sqlite3.connect('db/labels.db')

def connect_phishcore_db():
    return sqlite3.connect('db/phishstats.db')


def connect_new_labels():
    return init_unix_connection_engine(db_config).connect()





