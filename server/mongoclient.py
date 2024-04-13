import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi

def get_mongo_client():
    mongo_uri = os.environ.get("MONGO_URI")
    print("MONGO_URI:", mongo_uri)  # Print the connection string
    try:
        client = MongoClient(mongo_uri, server_api=ServerApi('1'), tlsAllowInvalidCertificates=True)
        return client
    except Exception as e:
        print("Error connecting to MongoDB:", e)
        raise

def write_entry(client, username, html, css):
    # Specify the database name (will be created if it doesn't exist)
    db_name = 'ResuMe'
    db = client[db_name]

    # Specify the collection name (will be created on first insert)
    collection_name = 'user_websites'
    collection = db[collection_name]
    doc = {
        "username": username,
        "html": html,
        "css": css
    }
    # Insert the document into the collection
    result = collection.insert_one(doc)

    # Optional: Print the ID of the newly inserted document
    print("Inserted document with ID:", result.inserted_id)
    
def verify_connection(client):
    try:
        print("Attempting to ping...")
        client.admin.command('ping')
        print("Ping successful!")
    except Exception as e:
        print("Ping failed:", e)

if __name__ == "__main__":
    client = get_mongo_client()
    verify_connection(client)