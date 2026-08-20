import requests
import json
from flask import Flask, jsonify, request
from datetime import date, timedelta
import sqlite3
from types import MappingProxyType

app = Flask(__name__)

with open("apiCnofig.json", "r") as file:
    raw_data = json.load(file)
CONFIG_RAW = raw_data

CONFIG = MappingProxyType(raw_data)

currentYear = date.today().year

# Function to get access token using username and password
def get_access_token(username, password, token_url):
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    data = {
          'username': username,
          'password': password,
          'grant_type': "password",
          'client_id': "acled",
          'scope': "authenticated"
    }

    response = requests.post(token_url, headers=headers, data=data)

    if response.status_code == 200:
        token_data = response.json()
        ## print(token_data)
        return token_data['access_token']
    else:
        raise Exception(f"Failed to get access token: {response.status_code} {response.text}")

@app.route("/retrieveData", methods = ["GET"])
def get_data():
    year = request.args.get("currentYear", type=int)
    print(f"Year: ", type(year)) 
    # Get an access token
    my_token = get_access_token(
        username = CONFIG["username"],
        password=CONFIG["password"],
        token_url="https://acleddata.com/oauth/token",
    )

    

    # Option #2 (parameters as a dictionary)
    parameters = {
        "country": "United States",
        "year": int(year),
        "fields": "event_id_cnty|event_date|disorder_type|event_type|sub_event_type|location|admin1|longitude|latitude|fatalities|notes",
    }

    response = requests.get(
        "https://acleddata.com/api/acled/read?_format=json",
        params=parameters,
        headers={"Authorization": f"Bearer {my_token}", "Content-Type": "application/json"},
    )
    if response.json()["status"] == 200:
        ## print(response.json())
        print(len(response.json()))
        return response.json()
    else:
        print("Data request failed.")
        return response.json()

@app.route("/initiateCookies", methods = ["GET", "POST"])
def initiateCookies():
    currentScore = request.values.get('currentScore', 0, type = float)
    connection = sqlite3.connect('cookies.db')
    cursor = connection.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS cookies(id INTEGER PRIMARY KEY AUTOINCREMENT, score REAL)""")
    cursor.execute("""SELECT * FROM cookies""")
    previousValue = cursor.fetchone()
    cursor.execute("DELETE FROM cookies")
    cursor.execute("INSERT INTO cookies (score) VALUES (?)", (currentScore,))
    connection.commit()
    connection.close()
    if (previousValue == None):
        return {"previousValue": None}
    return {"previousValue": previousValue[1]}
if __name__ == '__main__':
    app.run(debug=True, use_reloader = False, port=5000)