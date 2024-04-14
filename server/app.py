from flask import Flask, render_template, jsonify, render_template_string, request
from flask_cors import CORS, cross_origin
import google.generativeai as genai
from dotenv import load_dotenv
from mongoclient import get_mongo_client, write_entry, read_entry
import PIL.Image
import os
import io
import fitz
import io
import json


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
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
@cross_origin(origin='*')
def gemini_query():
    genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
    # Get the uploaded PDF file
    resume_file = request.files.get('resume', None)
    username = request.form['username']
    theme = request.form['theme']
    print('theme: ', theme)
    print('username: ', username)
    model = genai.GenerativeModel(model_name='models/gemini-1.5-pro-latest')
    prompt_list = []
    
    # Add resume to prompt
    # Convert the FileStorage stream to bytes
    resume_bytes = resume_file.read()
    # Open the PDF file
    pdf = fitz.open("pdf", resume_bytes)
    # Iterate over each page and extract image
    for page_num in range(len(pdf)):
        page = pdf.load_page(page_num)
        pix = page.get_pixmap()
        img_data = pix.tobytes("ppm")

        # Open the image as a PIL Image
        image = PIL.Image.open(io.BytesIO(img_data))
        prompt_list.append(image)
    pdf.close()

    # prompt_list.append(resume)
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
    if len(parts) > 3:
        css = parts[3].removeprefix('css\n')
        # print('CSS -----------------------------------\n', css)
    

    client = get_mongo_client()
    write_entry(
        client,
        username,
        html,
        css
        )
    print(html)
    return json.dumps({'success':True}), 200

@app.route("/user/<username>", methods = ['GET'])
def get_user(username):
    client = get_mongo_client()
    res = read_entry(client, username)
    # Check if 'read_entry' returned a dictionary and that 'html' key exists
    if res and 'html' in res:
        html = '```' + res['html'] + '```'
    else:
        html = 'No HTML content found.'
    return render_template_string(html)

if __name__ == '__main__':
    load_dotenv()
    app.run()    