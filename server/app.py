from flask import Flask, render_template, jsonify, render_template_string
from flask_cors import CORS, cross_origin
import google.generativeai as genai
from dotenv import load_dotenv
from mongoclient import get_mongo_client, write_entry, read_entry
import PIL.Image
import os
import re


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
    return render_template('index.html')

@app.route("/gemini", methods = ['GET'])
def gemini_query(theme=None, resume=None, username=None):
    genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
    if theme == None:
        theme = 'theme1'
    if username == None:
        username = 'therkelson'
    model = genai.GenerativeModel(model_name='models/gemini-1.5-pro-latest')
    prompt_list = []
    
    # Get image
    directory = f'themes/{theme}'
    for filename in os.listdir(directory):
        f = os.path.join(directory, filename)
        if os.path.isfile(f):
            # print(f)
            img = PIL.Image.open(f)
            prompt_list.append(img)

    txt = 'Please build the HTML code, including the css styling in the header, for a beautiful personal website using all the information on my resume in the style of these photos. Do not use default fonts. Make the page aesthetically pleasing in terms of color and layout. Connect any buttons to the correct section of the webpage. Do not explain the results.'
    prompt_list.append(txt)

    response = model.generate_content(prompt_list)
    parts = response.text.split("```")
    print(parts)

    html = parts[1].removeprefix('html\n')
    css = None
    print('HTML -----------------------------------\n', html)
    if len(parts) > 2:
        css = parts[3].removeprefix('css\n')
        print('CSS -----------------------------------\n', css)
    

    client = get_mongo_client()
    write_entry(
        client,
        username,
        html,
        css
        )
    return 200

@app.route("/user", methods = ['GET'])
def get_user():
    username=None
    if username == None:
        username = "therkels"
    client = get_mongo_client()
    res = read_entry(client, username)
    html = '```' + res['html'] + '```'
    return render_template_string(html)

if __name__ == '__main__':
    load_dotenv()
    app.run()
