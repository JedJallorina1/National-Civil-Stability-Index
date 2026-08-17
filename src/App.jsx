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
        <div className = "stateInfoBox" style = {{transform: "translate(-50%, -10%)", display: displayStateInfoBox, padding: "20px", "border-radius": "5px", border: "dashed 0.1px rgba(207, 225, 255, 0.15)"}}>
            <h3 style = {{textTransform:  "uppercase"}}>{selectedState}</h3>
            <h4> lawful assemblies</h4>
            <h4> unlawful assemblies</h4>
            <h4> violent assemblies</h4>
            <h4> federal deployments</h4> 
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
  let lawfulAssembliesCount = 0;
  let unlawfulAssembliesCount = 0;
  let riotsCount = 0;
  let federalMobilizationsCount = 0;
  let civilStabilityRating = 0;

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
        <h1>{civilStabilityRating}</h1>
      </div>
      <div className = "map-container">
        <MapChart/> 
        <div className = "map-highlights-container">
          <h3>{lawfulAssembliesCount} LAWFUL ASSEMBLIES</h3>
          <h3>{unlawfulAssembliesCount} UNLAWFUL ASSEMBLIES</h3>
          <h3>{riotsCount} RIOTS</h3>
          <h3>{federalMobilizationsCount} FEDERAL MOBILIZATIONS</h3>
        </div>
      </div>

    </div>
  </>
  )
}

export default App
