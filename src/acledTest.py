import requests
import json

CONFIG = {
    "username": "jrj5656@psu.edu",
    "password": "nationalCivilStabilityIndex"
}

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


# Get an access token
my_token = get_access_token(
    username = CONFIG["username"],
    password=CONFIG["password"],
    token_url="https://acleddata.com/oauth/token",
)


# Option #2 (parameters as a dictionary)
parameters = {
    "country": "United States",
    "year": 2025,
    "fields": "event_id_cnty|event_date|event_type|sub_event_type|location|state|longitude|latitude|fatalities"
}

response = requests.get(
    "https://acleddata.com/api/acled/read?_format=json",
    params=parameters,
    headers={"Authorization": f"Bearer {my_token}", "Content-Type": "application/json"},
)
if response.json()["status"] == 200:
    print(
        "Request successful"
    )

