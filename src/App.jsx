import { useState, useEffect } from 'react';
import ncsiLogo from './assets/ncsiLogo.jpg';
import React from 'react';
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


function MapChart({selectedStateIncidents, mapData}) {
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
            <h4> {selectedStateIncidents[selectedState]?.filter(incident => incident.sub_event_type === "Peaceful protest").length ?? 0} LAWFUL ASSEMBLIES</h4>
            <h4> {selectedStateIncidents[selectedState]?.filter(incident => incident.sub_event_type === "Protest with intervention").length ?? 0} UNLAWFUL ASSEMBLIES</h4>
            <h4> {selectedStateIncidents[selectedState]?.filter(incident => incident.sub_event_type === "Violent demonstration" || incident.sub_event_type === "Mob violence").length ?? 0} RIOTS</h4>
            <h4> {selectedStateIncidents[selectedState]?.filter(incident => incident.disorder_type === "Political violence").length ?? 0} POLITICAL ATTACKS</h4> 
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
      
      {mapData.map(incident => {
        let dotColor = "chartreuse"
        let radius = 1
        let stroke = 2;
        if (incident.sub_event_type == "Peaceful protest")
        {
          // console.log(incident.disorder_type);
          dotColor = ("lightCoral");
          radius = 1
          stroke = 2;
        }
        else if (incident.sub_event_type == "Protest with intervention" || incident.sub_event_type == "Excessive force against protesters")
        {
          // console.log(incident.disorder_type);
          dotColor = "mediumVioletRed";
          radius = 2;
          stroke = 4;
        }
        else if (incident.sub_event_type == "Violent demonstration" || incident.sub_event_type == "Mob violence" ||
          incident.sub_event_type == "Looting/property destruction" || incident.sub_event_type == "Armed clash")
        {
          console.log(incident.sub_event_type);
          dotColor = ("maroon");
          radius = 3;
          stroke = 6;
        }
        return(
        <Marker key = {incident.event_id_cnty} coordinates = {[Number(incident.longitude), Number(incident.latitude)]}>
        <circle r = {radius} fill = {dotColor} stroke = {dotColor} strokeWidth = {stroke}/>
        </Marker>);
      })}
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
  const [selectedStateIncidents, setSelectedStateIncidents] = useState("California");
  // WEIGHTS
  const peacefulProtestWeight = 0.01;
  const protestWithInterventionWeight = 0.2;
  const excessiveForceWeight = 0.5;
  const violentDemonstrationWeight = 1.0;
  const mobViolenceWeight = 2.0;

  const sexualViolenceWeight = 1.0;
  const arrestsWeight = 1.0;
  const lootingWeight = 2.0;
  const attackWeight = 1.5;

  const politicalViolenceWeight = 5.0;


  const daysElapsed = 365;
  const scalingFactor = 1.5;

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

  useEffect(() => {
    fetch('/retrieveData').then(response=>response.json()).then(data=>{
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

      setPoliticalViolenceCount(politicalViolenceCountTemp);

      const totalIncidentCount = (peacefulCountTemp + protestWithInterventionCountTemp + excessiveForceCountTemp + violentDemonstrationCountTemp + mobViolenceCountTemp + politicalViolenceCountTemp + sexualViolenceCountTemp + arrestCountTemp + attackCountTemp + lootingCountTemp);
      const protestFrequency =  totalIncidentCount / daysElapsed;
      const weightedSeverity = (peacefulProtestWeight*peacefulCountTemp)+
      (protestWithInterventionWeight*protestWithInterventionCountTemp) +
      (excessiveForceWeight * excessiveForceCountTemp) + 
      (violentDemonstrationWeight * violentDemonstrationCountTemp) + 
      (mobViolenceWeight * mobViolenceCountTemp) + 
      (sexualViolenceWeight*sexualViolenceCountTemp) +
      (arrestsWeight * arrestCountTemp) +
      (attackWeight * attackCountTemp) +
      (lootingWeight * lootingCountTemp) +
      (politicalViolenceWeight * politicalViolenceCountTemp);
      const averageIncidentIntensity = weightedSeverity / totalIncidentCount;
      const stabilityRating = (100 * Math.pow(Math.E, (-1 * scalingFactor * protestFrequency * averageIncidentIntensity)));

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
        setCol("chartreuse");
      }

    setCivilStabilityRating(Math.trunc(stabilityRating * 10) / 10);

    // SAVE DATA TO STATE INCIDENTS JSON
    fetch('/src/state-incidents.json').then(response=>response.json()).then(response2=>
    {
      Object.keys(response2).forEach(key=>
      {
        response2[key] = data.data.filter(incident => incident.admin1 === key); 
        // console.log(response2)
      });
      setSelectedStateIncidents(response2);
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
        <MapChart selectedStateIncidents = {selectedStateIncidents} mapData = {data}/> 
        <div className = "map-highlights-container">
          <h3>{peacefulProtestCount} LAWFUL ASSEMBLIES</h3>
          <h3>{protestWithInterventionCount} UNLAWFUL ASSEMBLIES</h3>
          <h3>{(violentDemonstrationCount + lootingCount) +  mobViolenceCount} RIOTS</h3>
          <h3>{politicalViolenceCount} POLITICAL ATTACKS</h3>
        </div>
      </div>

    </div>
  </>
  )
}

export default App
