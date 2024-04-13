from flask import Flask, render_template, jsonify, render_template_string, request
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

@app.route("/gemini",  methods=['POST'])
def gemini_query():
    genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
    # example link
    # async function sendFormData(resumePath, theme, username) {
    #  formData.append('resume', document.querySelector(resumePath).files[0]);
    # formData.append('theme', theme);
    # formData.append('username', username);

    # try {
    #     const response = await fetch('/gemini', {
    #         method: 'POST',
    #         body: formData
    #     });
    # sendFormData('#resumeInput', 'dark', 'johndoe');
    resume = request.files['resume']
    theme = request.args.get('theme')
    username = request.args.get('username')
    if theme == None:
        theme = 'theme1'
    if username == None:
        username = 'therkelson'
    if resume == None:
        resume = ''
    model = genai.GenerativeModel(model_name='models/gemini-1.5-pro-latest')
    prompt_list = []
    
    # Add resume to prompt
    prompt_list.append(resume)
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
    # print('HTML -----------------------------------\n', html)
    if len(parts) > 2:
        css = parts[3].removeprefix('css\n')
        # print('CSS -----------------------------------\n', css)
    

    client = get_mongo_client()
    write_entry(
        client,
        username,
        html,
        css
        )
    return 200

@app.route("/user/<username>", methods = ['GET'])
def get_user(username):
    if username == None:
        username = "therkels"
    client = get_mongo_client()
    res = read_entry(client, username)
    html = '```' + res['html'] + '```'
    return render_template_string(html)

if __name__ == '__main__':
    load_dotenv()
    app.run()
