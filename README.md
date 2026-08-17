NATIONAL CIVIL STABILITY INDEX 
POC: Jed Jallorina

DISCLAIMER:
This project is NOT sponsored by the U.S. government. All data is sourced from public APIs and reputable news sources. Information may be inaccurate, and is not indicative of actual public safety directives. Refer to official U.S. government sources and directives for all safety-related decisions.

BLUF: 
The NCSI is a real-time dashboard that reports on civil unrest/motivated violent incidents across the United States, leveraging public federal APIs and reputable news sources to create local Incident objects. Using these incidents, a Civil Stability Score is calculated on a weighted basis, estimating the nation’s current overall domestic stability. Incidents are displayed on a national map, which users can interact with to display more details regarding each case. 

APIs/Sources:
1. ACLED API
2. FEMA IPAWS
3. GovInfo (Executive Orders)
4. Web Scraping CNN / Fox (?)

CLASSIFICATION GUIDE

INCIDENT TYPE
1. Protests
    - Excessive Force Against Protesters
    - Protest With Intervention
    - Peaceful Protest
2. Riots
    - Violent Demonstration
    - Mob Violence
3. Political Violence
    - Attack On A Public Figure 

INCIDENT OBJECT
"Reported [TYPE] in [CITY]"
ID: 
City:
State:
Lat:
Long:
Date/Time Started:
Ongoing:
Date/Time Ended:
Classification:
Fatalities (boolean): 
Sources:
Confidence Score:

CIVIL STABILITY SCORE CALCULATION:


https://acleddata.com/api/acled/read?limit=10   