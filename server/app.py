from flask import Flask, render_template, jsonify
from flask_cors import CORS, cross_origin
import google.generativeai as genai
from dotenv import load_dotenv
import PIL.Image
import os


app = Flask(__name__)
CORS(app) # This will enable CORS for all routes
@app.route("/test", methods = ['GET'])
def hello_world():
    payload_response = {
        "data": "hello from backend!",
        }
    
    return jsonify(payload_response)

@app.route("/")
def home():
    gemini_query()
    return render_template('index.html')

@app.route("/gemini", methods = ['GET'])
def gemini_query():
    genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
    model = genai.GenerativeModel('gemini-pro')
    #TODO: replace image sources!
    # img1 = PIL.Image.open('image.jpg')
    prompt = 'Say hi to me!'
    prompt_list = []
    # prompt_list.append(img1)
    prompt_list.append(prompt)
    response = model.generate_content(prompt_list)
    console.log(response)
    #TODO: add response to database
    return response

if __name__ == '__main__':
    load_dotenv()
    app.run()
