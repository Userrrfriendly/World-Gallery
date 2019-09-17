import React, { useState, useEffect, useContext } from "react";
import * as FlikrApi from "./requests/flikr";
import MapWrapper from "./components/map/mapContainer";
import StateContext from "./context/stateContext";
import DispatchContext from "./context/dispatchContext";
import { SET_BOUNDING_BOX, SET_SELECTION_MARKER } from "./context/rootReducer";

import Appbar from "./components/appBar/appBar";
import ExampleBasic from "./components/imageGrid/imageGrid";

function App() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [mapVisible, setMapVisible] = useState(false);
  const [resData, setResData] = useState(false);
  // const [urls, setUrls] = useState(false);

  /**MOVE TO REDUCER? */
  const [addMarker, setAddMarker] = useState(false);
  const disableAddMarker = () => setAddMarker(false);

  const pinPhotoOnMap = pin => {
    const { position, thumbnail, title, id } = pin;
    setAddMarker({
      position: position,
      thumbnail: thumbnail,
      title: title,
      id
    });
  };

  const toggleMap = () => {
    const prevState = mapVisible;
    setMapVisible(!prevState);
  };

  const searchFlikr = () => {
    console.log("fetching...");
    let searchParams;
    //= state.boundingBox ? state.boundingBox : state.selectionMarker;
    if (state.boundingBox) {
      searchParams = { ...state.boundingBox, type: "boundingBox" };
    } else if (state.selectionMarker) {
      searchParams = { ...state.selectionMarker, type: "marker" };
    } else {
      //should handle error
      //default to search by text for now
      searchParams = { ...state.selectionMarker, search: "Troll" };
    }
    FlikrApi.getPhotosByTitle(searchParams).then(res => {
      setResData(res);
    });
    // .then(() => {
    //   window.URLS = FlikrApi.flickrUrlConstructor(resData);
    // })
    // .then(() => console.log(urls));
  };

  // useEffect(() => {
  //   if (resData) {
  //     setUrls(FlikrApi.flickrUrlConstructor(resData));
  //     // window.URLS = urls;
  //   }
  // }, [resData]);

  useEffect(() => {
    console.log(state);
  }, [state]);

  const setBounds = bounds => {
    dispatch({
      type: SET_BOUNDING_BOX,
      boundingBox: bounds
    });
  };

  const setSelectionMarker = marker => {
    dispatch({
      type: SET_SELECTION_MARKER,
      selectionMarker: marker
    });
  };

  return (
    <div className="App">
      <Appbar toggleMap={toggleMap} searchFlikr={searchFlikr}>
        {/* <button onClick={searchFlikr}>FLIKR</button> */}
        {/* <header className="App-header"> */}
        {/* <button onClick={toggleMap}> Toggle Map</button> */}
        {/* <button onClick={searchFlikr}>Search Flikr</button> */}
        {/* </header> */}
        {mapVisible && (
          <MapWrapper
            setBounds={setBounds}
            setSelectionMarker={setSelectionMarker}
            addMarker={addMarker}
            disableAddMarker={disableAddMarker}
          />
        )}
        {/* {urls &&
        urls.default.map(url => (
          <Card
            src={url[0]}
            key={url[1]}
            photoId={url[1]}
            imgTitle={url[2]}
            user={url[3]}
            pinPhotoOnMap={pinPhotoOnMap}
          />
        ))} */}

        {resData && (
          <ExampleBasic
            photos={resData}
            title="Results"
            pinPhotoOnMap={pinPhotoOnMap}
            direction={"column"}
            columns={2}
          />
        )}
      </Appbar>
    </div>
  );
}

export default App;
