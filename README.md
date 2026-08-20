NATIONAL CIVIL STABILITY INDEX 
POC: Jed Jallorina

DISCLAIMER:
This project is NOT sponsored by the U.S. government. All data is sourced from public APIs and reputable news sources. Information may be inaccurate, and is not indicative of actual public safety directives. Refer to official U.S. government sources and directives for all safety-related decisions.

BLUF: 
The NCSI is a real-time dashboard that reports on civil unrest/motivated violent incidents across the United States, leveraging public federal APIs and reputable news sources to create local Incident objects. Using these incidents, a Civil Stability Score is calculated on a weighted basis, estimating the nation’s current overall domestic stability. Incidents are displayed on a national map, which users can interact with to display more details regarding each case. 

APIs/Sources:
1. ACLED API                        CHECK
2. FEMA IPAWS                       NO
3. GovInfo (Executive Orders)       NO
4. Web Scraping CNN / Fox (?)       NO

CLASSIFICATION GUIDE

INCIDENT TYPE
1. Protests
    - Excessive Force Against Protesters
    - Protest With Intervention / Unlawful Assembly
    - Peaceful Protest / Lawful Assembly
2. Riots
    - Violent Demonstration
    - Mob Violence
3. Political Violence
    - Attack On A Public Figure 
    - Attacks on civilians
    - Incidents fueled by extremism of any kind

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


https://acleddata.com/api/acled/read