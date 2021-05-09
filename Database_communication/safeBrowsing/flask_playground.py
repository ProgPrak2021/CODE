from flask import Flask, render_template, jsonify
import database_playground
from flask_cors import CORS  # import with me with the following cmd: pip install flask-cors --upgrade

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():
    # label calculation
    
    return "Hello CODE" 
   

@app.route('/urls/', methods=['GET'])
def urls():

   db = database_playground.connect_db() 
   con = db.cursor()

   con.execute(
       "SELECT site, category FROM sites_data ORDER BY site ASC")

   rows = con.fetchall()
   return jsonify(rows)
  #  return render_template("list.html", rows=rows)


@app.route('/urls/<url>', methods=['GET'])
def url(url):

   db = database_playground.connect_db() 
   con = db.cursor()

   con.execute(
       "SELECT site, category, cookies, requests_tracking FROM sites_data WHERE site = ? ORDER BY site ASC", [url])

   rows = con.fetchall()
   return jsonify(rows)
  #  return render_template("list.html", rows=rows)



if __name__ == '__main__':
   app.run(debug=True)
