from flask import Flask, render_template, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app) # This will enable CORS for all routes
@app.route("/test", methods = ['GET'])
def hello_world():
    payload_response = {
        "data": "hello from backend!",
        }
    
    return jsonify(payload_response)


if __name__ == '__main__':
   app.run()
