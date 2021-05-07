from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello_world():
    # label calculation
    return 'Hello, World!'

if __name__ == '__main__': # runs on port 5000,
    app.run()
