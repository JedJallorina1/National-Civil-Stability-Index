import { useState, useEffect } from 'react';
import ncsiLogo from './assets/ncsiLogo.jpg';
import React from 'react';
import{
  ComposableMap,
  Geographies,
  Geography,
  createCoordinates,
} from '@vnedyalk0v/react19-simple-maps';

import { feature } from 'topojson-client';
import usStates from './maps/states-10m.json';
import './App.css';

// const geoUrl = '/maps/states-10m.json';

function MapChart() {
  const [selectedState, setSelectedState] = useState(null);
  const states = feature(
    usStates,
    usStates.objects.states
  );
  
  function StateInfoBox()
    {
      let displayStateInfoBox = "none";
      if (selectedState != null)
      {
        displayStateInfoBox = "flex";
      } 
      return(
      <>
        <div className = "stateInfoBox" style = {{transform: "translate(-50%, -10%)", display: displayStateInfoBox, padding: "20px", "borderRadius": "5px", border: "dashed 0.1px rgba(207, 225, 255, 0.15)"}}>
            <h3 style = {{textTransform:  "uppercase"}}>{selectedState}</h3>
            <h4> lawful assemblies</h4>
            <h4> unlawful assemblies</h4>
            <h4> riots</h4>
            <h4> political attacks</h4> 
            <button onClick={() => setSelectedState(null)}>Close</button>
        </div>
      </>
      )
    }

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
          console.log("GEOGRAPHIES:", geographies);

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
    </ComposableMap>
    <StateInfoBox />
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
      <h3>{dateTime.toLocaleDateString()}, {dateTime.toLocaleTimeString()}</h3>
    </div>
  );
}

function App() 
{  
  // WEIGHTS
  const peacefulProtestWeight = 0.5;
  const protestWithInterventionWeight = 1.5;
  const excessiveForceWeight = 2.0;
  const violentDemonstrationWeight = 3.75;
  const mobViolenceWeight = 5.00;
  const politicalViolenceWeight = 10.0;
  const daysElapsed = 2190;

  // RATING COLORS
  const [col, setCol] = useState("chartreuse");

  const[data, setData] = useState([]);
  const[peacefulProtestCount, setPeacefulProtestCount] = useState(0);
  const[protestWithInterventionCount, setProtestWithInterventionCount] = useState(0);
  const[excessiveForceCount, setExcessiveForceCount] = useState(0);
  const[violentDemonstrationCount, setViolentDemonstrationCount] = useState(0);
  const[mobViolenceCount, setMobViolenceCount] = useState(0);
  const[politicalViolenceCount, setPoliticalViolenceCount] = useState(0);
  const[civilStabilityRating, setCivilStabilityRating] = useState(0)

  useEffect(() => {
    fetch('/retrieveData').then(response=>response.json()).then(data=>{
      setData(data.data);
      const peacefulCountTemp = data.data.filter(incident => incident.sub_event_type === "Peaceful protest").length;
      const protestWithInterventionCountTemp = data.data.filter(incident => incident.sub_event_type === "Protest with intervention").length;
      const excessiveForceCountTemp = data.data.filter(incident => incident.sub_event_type === "Excessive force against protesters").length;
      const violentDemonstrationCountTemp = data.data.filter(incident => incident.sub_event_type === "Violent demonstration").length;
      const mobViolenceCountTemp = data.data.filter(incident => incident.sub_event_type === "Mob violence").length;
      const politicalViolenceCountTemp = data.data.filter(incident => incident.event_type === "Attack" || incident.event_type === "Remote explosive/landmine/IED" || incident.event_type === "Abduction/forced disappearance" ||incident.event_type === "Suicide bomb" || incident.event_type === "Grenade" || incident.event_type === "Sexual violence").length;
      setPeacefulProtestCount(peacefulCountTemp);
      setProtestWithInterventionCount(protestWithInterventionCountTemp);
      setExcessiveForceCount(excessiveForceCountTemp);
      setViolentDemonstrationCount(violentDemonstrationCountTemp);
      setMobViolenceCount(mobViolenceCountTemp);
      setPoliticalViolenceCount(politicalViolenceCountTemp);
      const tempRating = (Math.trunc(
        ((peacefulProtestWeight)*(peacefulCountTemp) + 
        (protestWithInterventionWeight)*(protestWithInterventionCountTemp) + 
        (excessiveForceWeight) * (excessiveForceCountTemp) + 
        (violentDemonstrationWeight) *(violentDemonstrationCountTemp) + 
        (mobViolenceWeight) * (mobViolenceCountTemp) + 
        (politicalViolenceWeight) * (politicalViolenceCountTemp)) 
        / (daysElapsed) * 1000 * 10) / 10
    );
    if (tempRating < 30)
    {
      setCol("red");
    }
    else if (tempRating < 60)
    {
      setCol("yellow");
    }
    else
    {
      setCol("chartreuse");
    }
    setCivilStabilityRating(Math.trunc((100-tempRating) * 10) / 10);

    // SAVE DATA TO STATE INCIDENTS JSON
    fetch('/src/state-incidents.json').then(response=>response.json()).then(response2=>
    {
      Object.keys(response2).forEach(key=>
      {
        response2[key] = data.data.filter(incident => incident.admin1 === key); 
      });
      console.log(response2);
    })
    
  })
  }, []);
  
  

  return(
  <>
    <title>NCSI</title>
    <div className = "header-container">
      <div className = "header-left">
        <h1>NATIONAL CIVIL STABILITY INDEX</h1>
        <CurrentDate />
      </div>
      <div className = "button-group">
        <button>Refresh</button>
        <button>About</button>
        <button>View all activity</button>
      </div>
          </div>
    <div className = "main-container">
      <div className = "score-container">
        <h2>CIVIL STABILITY RATING:</h2>
        <h1 style = {{color: col}}>{civilStabilityRating}</h1>
      </div>
      <div className = "map-container">
        <MapChart/> 
        <div className = "map-highlights-container">
          <h3>{peacefulProtestCount} LAWFUL ASSEMBLIES</h3>
          <h3>{protestWithInterventionCount} UNLAWFUL ASSEMBLIES</h3>
          <h3>{violentDemonstrationCount + mobViolenceCount} RIOTS</h3>
          <h3>{politicalViolenceCount} POLITICAL ATTACKS</h3>
        </div>
      </div>

    </div>
  </>
  )
}

export default App
