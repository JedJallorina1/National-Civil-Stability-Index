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
  const states = feature(
    usStates,
    usStates.objects.states
  );
  
  return (
    <ComposableMap
      projection="geoAlbersUsa"
      width={800}
      height={500}
      // delete this later.
      debug={true}
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
                hover: {outline:"none"},
                pressed:{outline: "none"}
                }}
              onClick={() => {}}
            />
          ));
        }}
      </Geographies>
    </ComposableMap>
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
  return(
  <>
    <title>National Civil Stability Index</title>
    <div className = "header-container">
      <div className = "header-left">
        <h1>National Civil Stability Index</h1>
        <CurrentDate />
      </div>
      <div class = "button-group">
        <button>Refresh</button>
        <button>About</button>
        <button>View all activity</button>
      </div>
          </div>
    <div className = "main-container">
      <div className = "score-container">
        <h2>Civil Stability Rating:</h2>
        <h1>23</h1>
      </div>
      <div className = "map-container">
        <MapChart/> 
        <div className = "map-highlights-container">
          <h3>12 lawful assemblies</h3>
          <h3>2 unlawful assemblies</h3>
          <h3>4 violent incidents</h3>
          <h3>0 federal deployments</h3>
        </div>
      </div>

    </div>
  </>
  )
}

export default App
