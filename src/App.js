import React, { useState, useEffect } from "react";
import "./App.css";
import * as FlikrApi from "./requests/flikr";
import Card from "./components/card/card";

// import MapWrapper from "./components/map/MapWrapper";
import MapWrapper from "./components/map/mapContainer";

const marker = {
  title: "Patmos",
  position: { lat: 37.308679, lng: 26.546345 }
};

function App() {
  const [mapVisible, setMapVisible] = useState(false);
  const [resData, setResData] = useState(false);
  const [urls, setUrls] = useState(false);

  const toggleMap = () => {
    const prevState = mapVisible;
    setMapVisible(!prevState);
  };

  const searchFlikr = () => {
    console.log("fetching...");
    FlikrApi.getPhotosByTitle(marker).then(res => {
      setResData(res);
    });
    // .then(() => {
    //   window.URLS = FlikrApi.flickrUrlConstructor(resData);
    // })
    // .then(() => console.log(urls));
  };

  useEffect(() => {
    if (resData) {
      setUrls(FlikrApi.flickrUrlConstructor(resData));
      // window.URLS = urls;
    }
  }, [resData]);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={toggleMap}> Toggle Map</button>
        <button onClick={searchFlikr}>Search Flikr</button>
      </header>
      {mapVisible && <MapWrapper />}
      {/* {resData && resData.map()} */}
      {urls &&
        urls.default.map(url => (
          <Card
            src={url[0]}
            key={url[1]}
            photoId={url[1]}
            imgTitle={url[2]}
            user={url[3]}
          />
        ))}
    </div>
  );
}

export default App;
