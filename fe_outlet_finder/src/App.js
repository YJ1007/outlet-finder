import './App.css';
import { getNearbyOutlets } from "./bl/outlets.js";
import React, { useState } from 'react';

export default function App() {
  let lat = React.createRef();
  let lng = React.createRef();
  let [area, setArea] = useState("");

  let onFind = (e) => {
    setArea("");
    let latCoord = parseFloat(lat.current.value);
    let lngCoord = parseFloat(lng.current.value);


    if(isNaN(latCoord) || isNaN(lngCoord)){
      alert("Incorrect input");
      return;
    }

    getNearbyOutlets([lngCoord, latCoord], (e, d) => {
      if(e)
        alert("e", e);
      else if(d && d.name)
        setArea(d.name);
      else
        alert("unexpected error");
    });
  };

  return (
    <div style={{padding: 20}}>
      <p style={{fontSize: 18, fontWeight: "bold"}}>Find outlet by coordinates</p>
      <input ref={lat} type="text" placeholder="Latitude"/>
      <input ref={lng} type="text" placeholder="Longitude"/>
      <button onClick={onFind}>Find</button>
      <br/>
      <p style={{fontSize: 18, fontWeight: "bold"}}>{area}</p>
    </div>
  );
}
