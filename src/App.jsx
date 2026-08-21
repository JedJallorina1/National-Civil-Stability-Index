import { useState, useEffect } from 'react';
import ncsiLogo from './assets/ncsiLogo.jpg';
import React from 'react';
import { LineWave } from 'react-loader-spinner';
import{
  ComposableMap,
  Geographies,
  Geography,
  createCoordinates,
  Marker,
} from '@vnedyalk0v/react19-simple-maps';

import { feature } from 'topojson-client';
import usStates from './maps/states-10m.json';
import './App.css';

// const geoUrl = '/maps/states-10m.json';

function AboutPopup({showAboutPopup, setShowAboutPopup})
  {
    if (showAboutPopup == "none")
    {
      return null;
    }
    return(
    <div className = "about-popup" display={showAboutPopup}>
      <h3>About NCSI</h3>
      <p>POC: Jed Jallorina {"\n\n"}

DISCLAIMER:
This project is NOT sponsored by the U.S. government. All data is sourced from public APIs and reputable news sources. Information may be inaccurate, and is not indicative of actual public safety directives. Refer to official U.S. government sources and directives for all safety-related decisions.{"\n\n"}

BLUF: 
The NCSI is a real-time dashboard that reports on civil unrest/motivated violent incidents across the United States, leveraging public federal APIs and reputable news sources to create local Incident objects. Using these incidents, a Civil Stability Rating is calculated on a weighted basis, estimating the nation’s current overall domestic stability. Incidents are displayed on a national map, which users can interact with to display more details regarding each case. 
</p>
    <button onClick = {()=>{setShowAboutPopup("none"); console.log(showAboutPopup)}}>Close</button>
    </div>)
  };

function AboutButton({showAboutPopup, setShowAboutPopup})
{
  return <button onClick={()=>{setShowAboutPopup("flex"); console.log(showAboutPopup)}}>About</button>
}

function LoadingSpinner({showPopup}) {
  if (!showPopup)
  {
    return null;
  }
  
  return (
    <div style={{display: "flex", position: "fixed", alignSelf: "center", backgroundColor: 'black',
      flexDirection:"column", justifyContent:"center", alignItems:"center", padding: "100px", paddingLeft: "130px",
      paddingTop: "50px", paddingBottom:"50px", border: "dashed 0.1px rgba(207, 225, 255, 0.15)"
    }}>
      <h3>Loading...</h3>
    <LineWave
      visible={true}
      height="100"
      width="100"
      ariaLabel="hourglass-loading"
      wrapperStyle={{}} 
      wrapperClass=""
      colors={['chartreuse', 'black']}
    />
    </div>
  )
}

function DropdownMenu({setYear})
{   
  const startYear = 2020;
  const currentYear = new Date().getFullYear();
  const years = Array.from(({length:currentYear - startYear + 1}), (_, i) => startYear + i);
  return(
  <select name="select" defaultValue={"2025"} onChange={(event)=>setYear(Number(event.target.value))}>
    {years.map((item, index) => (
      <option key = {index}>{item}</option>
    ))}
</select>)
}

function MapChart({selectedStateIncidents, mapData, year}) {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const states = feature(
    usStates,
    usStates.objects.states
  );

  
  function StateInfoBox(year)
    {
      let displayStateInfoBox = "none";
      if (selectedState != null)
      {
        displayStateInfoBox = "flex";
      }
      
      return(
      <>
        <div className = "stateInfoBox" style = {{
          top: "30%", left: "50%",
          transform: "translate(-50%, -0%)", 
          display: displayStateInfoBox, 
          padding: "20px"}}>
            <h3 style = {{textTransform:  "uppercase"}}>{selectedState}, {Number(year["year"])}</h3>
            <h4> {selectedStateIncidents[selectedState]?.filter(incident => incident.sub_event_type === "Peaceful protest").length ?? 0} LAWFUL ASSEMBLIES</h4>
            <h4> {selectedStateIncidents[selectedState]?.filter(incident => incident.sub_event_type === "Protest with intervention").length ?? 0} UNLAWFUL ASSEMBLIES</h4>
            <h4> {selectedStateIncidents[selectedState]?.filter(incident => incident.sub_event_type === "Violent demonstration" || incident.sub_event_type === "Mob violence").length ?? 0} RIOTS</h4>
            <h4> {selectedStateIncidents[selectedState]?.filter(incident => incident.disorder_type === "Political violence").length ?? 0} POLITICAL VIOLENCE INCIDENTS</h4> 
            <button onClick={() => setSelectedState(null)}>Close</button>
        </div>
      </>
      )
    }
  function IncidentInfoBox({incident})
    {
      console.log(incident)
      let displayIncidentInfoBox = "none"
      if (incident != null)
      {
        displayIncidentInfoBox = "flex";
      }
      console.log(displayIncidentInfoBox)
      if (incident == null)
      {
        return null
      }
      return(
        <div className = "incident-info-box" style = {{
          width: "90vw", 
          maxWidth: "75vw", 
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          boxSizing:"border-box", 
          display: displayIncidentInfoBox, 
          padding: "100px", paddingBottom:"100px", 
          margin:"50px",paddingTop:"100px"}}>
            <h3 style = {{textTransform:  "uppercase"}}>{incident.sub_event_type ?? "None"} in {incident.location ?? "null"} on {incident.event_date}</h3>
            <h4>{incident.notes ?? null}</h4> 
            <h4>Participants: {incident.actor1}, {incident.actor2}</h4>
            <h4>Fatalities: {incident.fatalities}</h4>
            <button onClick={() => setSelectedIncident(null)}>Close</button>
        </div>
      )
    }
  
  // const [hoveredIncident, setHoveredIncident] = useState(null);
  return (
    <>
    <ComposableMap
      projection="geoAlbersUsa"
      width={800}
      height={500}
      // delete this later.
      // debug = {true}
    >
      
      <Geographies
        geography = {states}
        onGeographyError={(error) => {
          console.error("GEOGRAPHY ERROR:", error);
        }}
      >
        {({ geographies }) => {
          // console.log("GEOGRAPHIES:", geographies);

          /* 
          geographies.map((geo) => (
            geo["civilUnrestActivityCount"] = 0
          ));
          */ 

          return geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="black"
              stroke="chartreuse"
              strokeWidth={0.5}
              style = {{
                default: {outline: "none"},
                hover: {outline:"none", fill: "chartreuse"},
                pressed:{outline: "none", fill: "black"},
                focused: {outline: "none", fill:"chartreuse"}
                }}
                onClick={() => {
                setSelectedState(geo["properties"].name);
              }}
              
            />
          ));
        }}
      </Geographies>
      
      {mapData.map(incident => {
        let dotColor = "red";
        let strokeColor = "red";
        let radius = 1;
        let stroke = 2;
        if (incident.sub_event_type == "Peaceful protest")
        {
          // console.log(incident.disorder_type);
          dotColor = ("red");
          strokeColor = ("red");
          radius = 1
          stroke = 2;
        }
        else if (incident.sub_event_type == "Protest with intervention" || incident.sub_event_type == "Excessive force against protesters")
        {
          // console.log(incident.disorder_type);
          dotColor = ("darkRed");
          strokeColor = ("darkRed");
          radius = 2;
          stroke = 4;
        }
        else if (incident.sub_event_type == "Violent demonstration" || incident.sub_event_type == "Mob violence" ||
          incident.sub_event_type == "Looting/property destruction" || incident.sub_event_type == "Armed clash" || 
          incident.sub_event_type == "Attack")
        {
          // console.log(incident.sub_event_type);
          dotColor = ("maroon");
          strokeColor = ("maroon");
          radius = 6  ;
          stroke = 6;
        }
        else
        {
          dotColor = ("orangeRed");
          strokeColor = ("orangeRed");
          radius = 2;
          stroke = 4;
        }
        if (incident.fatalities > 0)
        {
          dotColor = ("black")
          strokeColor = ("maroon");
          radius = 8;
          stroke = 4;
        }
        return(
        <Marker onClick={()=>{setSelectedIncident(incident); console.log(selectedIncident)}} key = {incident.event_id_cnty} coordinates = {[Number(incident.longitude), Number(incident.latitude)]}>
        <circle
        r= {radius}
        fill={dotColor}
        stroke={strokeColor}
        strokeWidth={stroke}
        // onMouseEnter={() => setHoveredIncident(incident.event_id_cnty)}
        // onMouseLeave={() => setHoveredIncident(null)}
      />
        </Marker>);
      })}
    </ComposableMap>
    <StateInfoBox year = {year}/>
    <IncidentInfoBox incident = {selectedIncident}/>
    </>
  );
}

function CurrentDate() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  

  return (
    <div>
      <h3>LIVE DATA | {dateTime.toLocaleDateString()}, {dateTime.toLocaleTimeString()}</h3>
    </div>
  );
}

function App() 
{  
  const [showPopup, setShowPopup] = useState(true);
  
  const [year, setYear] = useState(2025);
  const [selectedStateIncidents, setSelectedStateIncidents] = useState("California");
  // WEIGHTS
  const peacefulProtestWeight = 0.01;
  const protestWithInterventionWeight = 0.2;
  const excessiveForceWeight = 0.5;
  const violentDemonstrationWeight = 1.0;
  const mobViolenceWeight = 1.75;

  const sexualViolenceWeight = 1.0;
  const arrestsWeight = 0.5;
  const lootingWeight = 1.5;
  const attackWeight = 1.5;

  const politicalViolenceWeight = 5.0;


  const daysElapsed = 365;
  const scalingFactor = 1.0;

  // RATING COLORS
  const [col, setCol] = useState("chartreuse");

  const[data, setData] = useState([]);
  const[peacefulProtestCount, setPeacefulProtestCount] = useState(0);
  const[protestWithInterventionCount, setProtestWithInterventionCount] = useState(0);
  const[excessiveForceCount, setExcessiveForceCount] = useState(0);
  const[violentDemonstrationCount, setViolentDemonstrationCount] = useState(0);
  const[mobViolenceCount, setMobViolenceCount] = useState(0);

  const[sexualViolenceCount, setSexualViolenceCount] = useState(0);
  const[arrestCount, setArrestCount] = useState(0);
  const[lootingCount, setLootingCount] = useState(0);
  const[attackCount, setAttackCount] = useState(0);

  const[politicalViolenceCount, setPoliticalViolenceCount] = useState(0);
  const[civilStabilityRating, setCivilStabilityRating] = useState(0)
  const[fatalities, setFatalities] = useState(0);

  
  function renderPage(year)
  {
    setShowPopup(true);
    let params = {currentYear: year};
    let queryString = new URLSearchParams(params).toString();
    // FOR PRODUCTION
    let url = `https://national-civil-stability-index-production.up.railway.app/retrieveData?${queryString}`;
    // FOR DEV
    // let url = `/retrieveData?${queryString}`
    fetch(url).then(response=>response.json()).then(data=>{
      console.log((data.data));
      setData(data.data);
      const peacefulCountTemp = data.data.filter(incident => incident.sub_event_type === "Peaceful protest").length;
      const protestWithInterventionCountTemp = data.data.filter(incident => incident.sub_event_type === "Protest with intervention").length;
      const excessiveForceCountTemp = data.data.filter(incident => incident.sub_event_type === "Excessive force against protesters").length;
      const violentDemonstrationCountTemp = data.data.filter(incident => incident.sub_event_type === "Violent demonstration").length;
      const mobViolenceCountTemp = data.data.filter(incident => incident.sub_event_type === "Mob violence").length;

      const sexualViolenceCountTemp = data.data.filter(incident => incident.sub_event_type === "Sexual violence").length;
      const arrestCountTemp = data.data.filter(incident => incident.sub_event_type === "Arrests").length;
      const lootingCountTemp = data.data.filter(incident => incident.sub_event_type === "Looting/property destruction").length;
      const attackCountTemp = data.data.filter(incident => incident.sub_event_type === "Attack").length;
      const fatalIncidentList = data.data.filter(incident=>incident.fatalities > 0)
      console.log(fatalIncidentList)
      const fatalityCountTemp = fatalIncidentList.reduce((accumulator, currentValue, currentIndex) => {return accumulator +  Number(currentValue.fatalities)}, 0);
      // const fatalityCountTemp = 0;
      // console.log(fatalityCountTemp);
      

      const politicalViolenceCountTemp = data.data.filter(incident => incident.disorder_type === "Political violence").length;

      setPeacefulProtestCount(peacefulCountTemp);
      setProtestWithInterventionCount(protestWithInterventionCountTemp);
      setExcessiveForceCount(excessiveForceCountTemp);
      setViolentDemonstrationCount(violentDemonstrationCountTemp);
      setMobViolenceCount(mobViolenceCountTemp);

      setSexualViolenceCount(sexualViolenceCountTemp);
      setArrestCount(arrestCountTemp);
      setLootingCount(lootingCountTemp);
      setAttackCount(attackCountTemp);
      setFatalities(fatalityCountTemp);

      setPoliticalViolenceCount(politicalViolenceCountTemp);

      const totalIncidentCount = (peacefulCountTemp + protestWithInterventionCountTemp + excessiveForceCountTemp + violentDemonstrationCountTemp + mobViolenceCountTemp + politicalViolenceCountTemp + sexualViolenceCountTemp + arrestCountTemp + attackCountTemp + lootingCountTemp);
      const protestFrequency =  totalIncidentCount / daysElapsed;
      const weightedSeverity = (peacefulProtestWeight*peacefulCountTemp)+
      (protestWithInterventionWeight*protestWithInterventionCountTemp) +
      (excessiveForceWeight * excessiveForceCountTemp) + 
      (violentDemonstrationWeight * violentDemonstrationCountTemp) + 
      (mobViolenceWeight * mobViolenceCountTemp) + 
      (arrestsWeight * arrestCountTemp) +
      (lootingWeight * lootingCountTemp) +
      (politicalViolenceWeight * politicalViolenceCountTemp);
      const averageIncidentIntensity = weightedSeverity / totalIncidentCount;
      const stabilityRating = (100 * Math.pow(Math.E, (-1 * scalingFactor * protestFrequency * averageIncidentIntensity)));

      let previousRating = 0;

      previousRating = Number(localStorage.getItem('storedRating'))

      /* 
      let previousRating = 0;

      const params1 = {currentScore: stabilityRating};
      const queryString1 = new URLSearchParams(params1).toString();
      const url1 = `https://national-civil-stability-index-production.up.railway.app/initiateCookies?${queryString1}`;
      */
      

      if (stabilityRating < 33)
      {
        setCol("red");
      }
      else if (stabilityRating < 66)
      {
        setCol("orange");
      }
      else
      {
        setCol("green");
      }

    setCivilStabilityRating(Math.trunc(stabilityRating * 10) / 10);
    /*
    fetch(url1).then(response=>response.json()).then(data=>
      {
        previousRating = Number(data["previousValue"]);
        console.log(previousRating)
        const changeTextField = document.getElementById("changeSinceLast");
        let diff = Math.trunc(10 * (stabilityRating - previousRating)) / 10;
        if (diff > 0)
        {
          changeTextField.textContent = "+" + String(diff) + " change since last";
        }
        else{changeTextField.textContent = String(diff) + " change since last";}
      })
      */
      
    
    localStorage.setItem('storedRating', Number(stabilityRating));
    const changeTextField = document.getElementById("changeSinceLast");
    let diff = Math.trunc(10 * (stabilityRating - previousRating)) / 10;
    if (diff > 0)
    {
      changeTextField.textContent = "+" + String(diff) + " change since last";
    }
    else{changeTextField.textContent = String(diff) + " change since last";}

    // SAVE DATA TO STATE INCIDENTS JSON
    fetch('/state-incidents.json').then(response=>response.json()).then(response2=>
    {
      Object.keys(response2).forEach(key=>
      {
        response2[key] = data.data.filter(incident => incident.admin1 === key); 
        // console.log(response2)
      });
      setSelectedStateIncidents(response2);
    }).then(ans=>{
      setShowPopup(false);
      // console.log(showPopup);
      }
    )
    
  })
  }

  useEffect(() => {renderPage(year)}, [year]);
  
  const [showAboutPopup, setShowAboutPopup] = useState("none");

  return(
  <>
    <title>NCSI</title>
    <div className = "header-container">
      <div className = "header-left">
        <h1>NATIONAL CIVIL STABILITY INDEX</h1>
        <CurrentDate />
      </div>
      <div className = "button-group">
        <p>Choose a year: </p>
        <DropdownMenu setYear = {setYear}/>
        <AboutButton showAboutPopup = {showAboutPopup} setShowAboutPopup = {setShowAboutPopup}/>
        
      </div>
    </div>
    <div className = "main-container">
      <LoadingSpinner showPopup = {showPopup}/>
      <AboutPopup showAboutPopup = {showAboutPopup} setShowAboutPopup={setShowAboutPopup}/>
      <div className = "score-container">
        <h2>CIVIL STABILITY RATING:</h2>
        <h1 style = {{color: col}}>{civilStabilityRating}</h1>
        <h3 id = "changeSinceLast">... change since last</h3>
      </div>
      <div className = "map-container">
        <div className = "sub-map-container">
        <MapChart selectedStateIncidents = {selectedStateIncidents} mapData = {data} year = {year}/> 
        <p>Select a state or incident to view additional details.</p>
        </div>
        <div className = "map-highlights-container">
          <h3>{peacefulProtestCount} LAWFUL ASSEMBLIES</h3>
          <h3>{protestWithInterventionCount} UNLAWFUL ASSEMBLIES</h3>
          <h3>{(violentDemonstrationCount + lootingCount) +  mobViolenceCount + excessiveForceCount} RIOTS</h3>
          <h3>{politicalViolenceCount} POLITICAL VIOLENCE INCIDENTS</h3>
          <h3> {fatalities} CIVIL INCIDENT FATALITIES</h3>
        </div>
      </div>

    </div>
  </>
  )
}

export default App
