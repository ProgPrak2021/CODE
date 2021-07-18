from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()



def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config['MYSQL_HOST'] = os.environ.get('CLOUD_SQL_HOST')
    app.config['MYSQL_USER'] = os.environ.get('CLOUD_SQL_USERNAME')
    app.config['MYSQL_PASSWORD'] = os.environ.get('CLOUD_SQL_PASSWORD')
    app.config['MYSQL_DB'] = os.environ.get('CLOUD_SQL_DATABASE_NAME')

    CORS(app)

    with app.app_context():
      from . import routes


    return app
