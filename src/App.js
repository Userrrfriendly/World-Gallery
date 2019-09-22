import React, { useState, useEffect, useContext } from "react";
import * as FlikrApi from "./requests/flikr";
import MapWrapper from "./components/map/mapContainer";
import StateContext from "./context/stateContext";
import DispatchContext from "./context/dispatchContext";
import { SET_BOUNDING_BOX, SET_RADIUS_MARKER } from "./context/rootReducer";
// import Pagination from "material-ui-flat-pagination";

import Appbar from "./components/appBar/appBar";
import ImageGrid from "./components/imageGrid/imageGrid";
import AppControls from "./components/controls/controls";
// import { makeStyles } from "@material-ui/core"; //pagination

import LoadMoreButton from "./components/controls/loadMoreBtn";

//pagination
// const useStyles = makeStyles(theme => ({
//   root: {
//     "& button:first-child": {
//       borderRadius: "6px 0px 0px 6px"
//     },
//     "& button:last-child": {
//       borderRadius: "0px 6px 6px 0px"
//     }
//   },
//   colorInheritOther: {
//     marginTop: "1rem",
//     color: "black",
//     border: "1px solid grey",
//     borderRadius: "0",
//     fontWeight: "600"
//   },
//   colorInheritCurrent: {
//     color: "red",
//     marginTop: "1rem",
//     border: "1px solid grey",
//     borderRadius: "0"
//   }
// }));

function App() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  // const classes = useStyles(); //pagination
  // const [offset, setOffset] = useState(0); //pagination

  /**user location that will be fetched on page load with geoip-db,
  used only when the map loads to add initial radius marker */
  const [userLocation, setUserLocation] = useState(null);
  const [mapVisible, setMapVisible] = useState(true);
  const [photos, setPhotos] = useState(false);
  const [responseDetails, setResponseDetails] = useState(null);

  const [gridDirection, setGridDirection] = useState("row");
  const toggleGridDirection = () => {
    setGridDirection(gridDirection === "row" ? "column" : "row");
  };
  /**explicitly hide appbar if the lightbox is open */
  const [appBarHide, setAppBarHide] = useState(false);

  /** Triggers plot photo on map  */
  const [triggerPhotoMarker, setTriggerPhotoMarker] = useState(false);
  const disableTriggerPhotoMarker = () => setTriggerPhotoMarker(false);
  const pinPhotoOnMap = pin => {
    const { position, thumbnail, title, id } = pin;
    setTriggerPhotoMarker({
      position: position,
      thumbnail: thumbnail,
      title: title,
      id
    });
  };

  /* triggerPlotRadiusMarkerOnMap allows calling methods from anywhere inside mapContainer */
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
      searchParams = { ...state.radiusMarker, type: "radiusMarker" };
    } else {
      searchParams = {
        ...state.radiusMarker,
        search: "Search String goes here"
      };
    }

    FlikrApi.getPhotosByTitle(searchParams).then(data => {
      setResponseDetails({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalPhotos: data.totalPhotos,
        perPage: data.perPage,
        query: data.query
      });
      setPhotos(data.photos);
    });
  };

  const fetchNextPage = () => {
    console.log("fetching next page...");
    let searchParams;
    if (responseDetails.query.type === "boundingBox") {
      searchParams = { ...responseDetails.query };
    } else if (state.radiusMarker) {
      searchParams = { ...responseDetails.query };
    }

    if (responseDetails.currentPage < responseDetails.totalPages) {
      searchParams.page = responseDetails.currentPage + 1;
    }

    FlikrApi.getPhotosByTitle(searchParams).then(data => {
      setResponseDetails({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalPhotos: data.totalPhotos,
        perPage: data.perPage,
        query: data.query
      });
      const updatedPhotos = photos.concat(data.photos);
      console.log(updatedPhotos);
      setPhotos(updatedPhotos);
    });
  };

  useEffect(() => {
    //debugging only
    console.log(state);
  }, [state]);

  useEffect(() => {
    //debugging only
    console.log(photos);
  }, [photos]);

  useEffect(() => {
    /*fetch user location when app mounts*/
    fetch("https://geoip-db.com/json/42e6a770-b3ac-11e9-80ca-c95181800da7")
      .then(res => res.json())
      .then(position => {
        console.log({ lat: position.latitude, lng: position.longitude });
        setUserLocation({ lat: position.latitude, lng: position.longitude });
      })
      .catch(err => {
        /* if geoip-db call fails or if it is blocked by an add-blocker use native geolocation API for user position */
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

  //pagination
  // const handlePaginationClick = offset => {
  //   // this.setState({ offset });
  //   console.log(offset);
  //   setOffset(offset);
  // };

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
          gridDirection={gridDirection}
          toggleGridDirection={toggleGridDirection}
        />
        {mapVisible && (
          <MapWrapper
            state={state}
            userLocation={userLocation}
            setBounds={setBounds}
            getRadiusMarkerCoordinates={getRadiusMarkerCoordinates}
            /* photoMarker*/
            triggerPhotoMarker={triggerPhotoMarker}
            disableTriggerPhotoMarker={disableTriggerPhotoMarker}
            /* radius marker */
            triggerPlotRadiusMarkerOnMap={triggerPlotRadiusMarkerOnMap}
            disableRadiusTrigger={disableRadiusTrigger}
            /* boundingBox Trigger */
            triggerBoundingBox={triggerBoundingBox}
            disableBoundingBoxTrigger={disableBoundingBoxTrigger}
          />
        )}

        {photos && (
          <ImageGrid
            photos={photos}
            // title="Results"
            responseDetails={responseDetails}
            pinPhotoOnMap={pinPhotoOnMap}
            direction={gridDirection}
            columns={2}
            setAppBarHide={setAppBarHide}
          />
        )}
        {/* <Pagination
          classes={classes}
          size="medium"
          currentPageColor="inherit"
          otherPageColor="inherit"
          limit={1}
          offset={offset}
          total={100}
          reduced={true}
          onClick={(e, offset) => handlePaginationClick(offset)}
        /> */}
        {responseDetails &&
          responseDetails.currentPage < responseDetails.totalPages && (
            <LoadMoreButton onClick={fetchNextPage} />
          )}
      </Appbar>
    </div>
  );
}

export default App;
