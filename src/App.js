import React, { useState, useEffect, useContext } from "react";
import * as FlikrApi from "./requests/flikr";
import MapWrapper from "./components/map/mapContainer";
import StateContext from "./context/stateContext";
import DispatchContext from "./context/dispatchContext";
import { SET_BOUNDING_BOX, SET_RADIUS_MARKER } from "./context/rootReducer";

import Appbar from "./components/appBar/appBar";
import ImageGrid from "./components/imageGrid/imageGrid";
import AppControls from "./components/controls/controls";

function App() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  //user location that will be fetched on page load with geoip-db, used only when the map loads to add initial radius marker
  const [userLocation, setUserLocation] = useState(null);
  const [mapVisible, setMapVisible] = useState(true);
  const [resData, setResData] = useState(false);

  //explicitly hide appbar if the lightbox is open
  const [appBarHide, setAppBarHide] = useState(false);

  /**make this about photos */
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
  /**
   * triggerPlotRadiusMarkerOnMap allows calling methods from anywhere inside mapContainer
   */
  const [
    triggerPlotRadiusMarkerOnMap,
    setTtriggerPlotRadiusMarkerOnMap
  ] = useState(false);
  const pinRadiusMarkerOnMap = () => {
    setTtriggerPlotRadiusMarkerOnMap(true);
  };
  const disableRadiusTrigger = () => setTtriggerPlotRadiusMarkerOnMap(false);
  /**Bounds */
  const [triggerBoundingBox, setTriggerBoundingBox] = useState(false);
  const pinBoundingBoxOnMap = () => setTriggerBoundingBox(true);
  const disableBoundingBoxTrigger = () => setTriggerBoundingBox(false);

  const toggleMap = () => {
    const prevState = mapVisible;
    setMapVisible(!prevState);
  };

  const searchFlikr = () => {
    console.log("fetching...");
    let searchParams;
    if (state.boundingBox) {
      searchParams = { ...state.boundingBox, type: "boundingBox" };
    } else if (state.radiusMarker) {
      searchParams = { ...state.radiusMarker, type: "marker" };
    } else {
      searchParams = {
        ...state.radiusMarker,
        search: "Search String goes here"
      };
    }
    console.log(searchParams);
    FlikrApi.getPhotosByTitle(searchParams).then(res => {
      setResData(res);
    });
  };

  useEffect(() => {
    //debugging only
    console.log(state);
  }, [state]);

  useEffect(() => {
    //fetch user location when app mounts
    fetch("https://geoip-db.com/json/42e6a770-b3ac-11e9-80ca-c95181800da7")
      .then(res => res.json())
      .then(position => {
        console.log({ lat: position.latitude, lng: position.longitude });
        setUserLocation({ lat: position.latitude, lng: position.longitude });
      })
      .catch(err => {
        //if geoip-db call fails or if it is blocked by an add-blocker use native geolocation API for user position
        console.log(err);
        const success = position => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        };
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(success, err =>
            console.log(err)
          );
        }
      });
  }, []);

  const setBounds = bounds => {
    dispatch({
      type: SET_BOUNDING_BOX,
      boundingBox: bounds
    });
  };

  const getRadiusMarkerCoordinates = marker => {
    dispatch({
      type: SET_RADIUS_MARKER,
      radiusMarker: marker
    });
  };

  return (
    <div className="App">
      <Appbar
        toggleMap={toggleMap}
        searchFlikr={searchFlikr}
        appBarHide={appBarHide}
      >
        <AppControls
          pinRadiusMarkerOnMap={pinRadiusMarkerOnMap}
          pinBoundingBoxOnMap={pinBoundingBoxOnMap}
          searchFlikr={searchFlikr}
        />
        {mapVisible && (
          <MapWrapper
            state={state}
            userLocation={userLocation}
            setBounds={setBounds}
            getRadiusMarkerCoordinates={getRadiusMarkerCoordinates}
            addMarker={addMarker}
            disableAddMarker={disableAddMarker}
            // radius marker
            triggerPlotRadiusMarkerOnMap={triggerPlotRadiusMarkerOnMap}
            disableRadiusTrigger={disableRadiusTrigger}
            //boundingBox Trigger
            triggerBoundingBox={triggerBoundingBox}
            disableBoundingBoxTrigger={disableBoundingBoxTrigger}
          />
        )}

        {resData && (
          <ImageGrid
            photos={resData}
            title="Results"
            pinPhotoOnMap={pinPhotoOnMap}
            direction={"column"}
            columns={2}
            setAppBarHide={setAppBarHide}
          />
        )}
      </Appbar>
    </div>
  );
}

export default App;
