import React, { useState, useEffect, useContext } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import * as FlikrApi from "./requests/flikr";
import MapWrapper from "./components/map/mapContainer";
import StateContext from "./context/stateContext";
import DispatchContext from "./context/dispatchContext";
import {
  SET_BOUNDING_BOX,
  SET_RADIUS_MARKER,
  SET_USER_LOCATION,
  SET_SEARCH_CENTER,
  SET_SEARCH_RADIUS
} from "./context/rootReducer";

import Appbar from "./components/appBar/appBar";
import ImageGrid from "./components/imageGrid/imageGrid";

import LoadMoreButton from "./components/controls/loadMoreBtn";
import LoadingBar from "./components/LoadingBar/loadingBar";
import ControlPanel from "./components/controlPanel/controlPanel";
import ControlPanelMobile from "./components/controlPanel/controlPanelMobile";

function App() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const screenWidth900px = useMediaQuery("(min-width:900px)");

  const resultsRef = React.useRef(null);

  /**sorting filters for the results */
  const [sortMethod, setSortMethod] = useState("date-posted-desc");
  const handeSelectSortMethod = event => {
    setSortMethod(event.target.value);
  };

  /** option text for search */
  const [searchText, setSearchText] = useState("");
  const handleTextQueryChange = e => {
    setSearchText(e.target.value);
  };

  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [triggerZoom, setTriggerZoom] = useState(false);
  const [triggerCenter, setTriggerCenter] = useState(false);

  const zoomToSearchArea = () => setTriggerZoom(true);
  const disableZoom = () => setTriggerZoom(false);
  const centerSearchAreaOnMap = () => setTriggerCenter(true);
  const disableCenter = () => setTriggerCenter(false);

  const [mapVisible, setMapVisible] = useState(true); //REFACTOR FOR MAP TO COLLAPSE (height:0) OR DELETE METHOD
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

  const pinPhotoOnMap = React.useCallback(pin => {
    console.log("pinPhotoOnMAp");
    const { position, thumbnail, title, id, owner, thumbWidth } = pin;
    setTriggerPhotoMarker({
      position: position,
      thumbnail: thumbnail,
      title: title,
      id,
      owner,
      thumbWidth
      //src-screenset
    });
  }, []);

  /* triggerPlotRadiusMarkerOnMap allows calling methods from anywhere inside mapContainer */
  const [
    triggerPlotRadiusMarkerOnMap,
    setTtriggerPlotRadiusMarkerOnMap
  ] = useState(false);

  const disableRadiusTrigger = () => setTtriggerPlotRadiusMarkerOnMap(false);
  /**Bounds */
  // const [triggerBoundingBox, setTriggerBoundingBox] = useState(false);
  // const pinBoundingBoxOnMap = () => setTriggerBoundingBox(true);
  // const disableBoundingBoxTrigger = () => setTriggerBoundingBox(false);

  const toggleMap = () => {
    const prevState = mapVisible;
    setMapVisible(!prevState);
  };

  const searchFlikr = () => {
    console.log("fetching...");
    let searchParams;
    // if (state.boundingBox) {
    //   searchParams = { ...state.boundingBox, type: "boundingBox" };
    // } else if (state.radiusMarker) {
    //   searchParams = { ...state.radiusMarker, type: "radiusMarker" };
    // } else {
    //   searchParams = {
    //     ...state.radiusMarker,
    //     search: "Search String goes here"
    //   };
    // }
    searchParams = {
      lat: state.searchCenter.lat,
      lng: state.searchCenter.lng,
      radius: state.searchRadius,
      sortMethod,
      searchText
    };

    setLoadingPhotos(true);
    FlikrApi.getPhotosByTitle(searchParams)
      .then(data => {
        setLoadingPhotos(false);
        setResponseDetails({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalPhotos: data.totalPhotos,
          perPage: data.perPage,
          query: data.query,
          lat: state.searchCenter.lat,
          lng: state.searchCenter.lng,
          radius: state.searchRadius,
          sortMethod,
          searchText
        });
        setPhotos(data.photos);

        /* if scrollIntoView is called syncronously there is a chance that the images are not loaded yet
         * thus the body is still the same height and the element simply cannot be scroll to top because instead:
         *  When the response is loaded wait 100ms for the body to resize (while image gallery loads),
         * then scroll to the results (an empty div right above the results was used in order to avoid forwardingrefs)         *
         */
        window.setTimeout(() => {
          resultsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
          window.END = document.body.offsetHeight;
        }, 100);
      })
      .catch(error => {
        console.log(error);
        setLoadingPhotos(false);
      });
  };

  const fetchNextPage = () => {
    console.log("fetching next page...");
    // let searchParams;
    // if (responseDetails.query.type === "boundingBox") {
    //   searchParams = { ...responseDetails.query };
    // } else if (state.radiusMarker) {
    //   searchParams = { ...responseDetails.query };
    // }
    const searchParams = { ...responseDetails };
    if (responseDetails.currentPage < responseDetails.totalPages) {
      searchParams.page = responseDetails.currentPage + 1;
    }

    setLoadingPhotos(true);

    FlikrApi.getPhotosByTitle(searchParams)
      .then(data => {
        setLoadingPhotos(false);

        setResponseDetails({
          ...responseDetails,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalPhotos: data.totalPhotos,
          perPage: data.perPage,
          query: data.query
        });
        const updatedPhotos = photos.concat(data.photos);
        setPhotos(updatedPhotos);
      })
      .catch(error => {
        setLoadingPhotos(false);
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
        dispatch({
          type: SET_USER_LOCATION,
          userLocation: { lat: position.latitude, lng: position.longitude }
        });
      })
      .catch(err => {
        /* if geoip-db call fails or if it is blocked by an add-blocker use native geolocation API for user position */
        console.log(err);
        const success = position => {
          dispatch({
            type: SET_USER_LOCATION,
            userLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
        };
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(success, err =>
            console.log(err)
          );
        }
      });
  }, [dispatch]);

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

  const setSearchCenter = center => {
    dispatch({
      type: SET_SEARCH_CENTER,
      searchCenter: center
    });
  };

  const setSearchRadius = radius => {
    dispatch({
      type: SET_SEARCH_RADIUS,
      searchRadius: radius
    });
  };

  return (
    <div className="App">
      <Appbar
        toggleMap={toggleMap}
        // searchFlikr={searchFlikr}
        appBarHide={appBarHide}
        photos={responseDetails ? responseDetails.totalPages : 0}
        toggleGridDirection={toggleGridDirection}
        gridDirection={gridDirection}
      >
        <section
          // className={classes.main_container}
          style={
            screenWidth900px
              ? { display: "flex", height: "calc(100vh - 7px - 64px)" } //7px margins, 64appbar
              : {
                  display: "flex",
                  height: "calc(100vh - 7px - 64px )",
                  flexFlow: "column"
                }
          }
        >
          {screenWidth900px && (
            <ControlPanel
              setSearchRadius={setSearchRadius}
              searchFlikr={searchFlikr}
              loadingPhotos={loadingPhotos}
              zoomToSearchArea={zoomToSearchArea}
              centerSearchAreaOnMap={centerSearchAreaOnMap}
              sortMethod={sortMethod}
              handeSelectSortMethod={handeSelectSortMethod}
              handleTextQueryChange={handleTextQueryChange}
              searchText={searchText}
            ></ControlPanel>
          )}
          {mapVisible && (
            <MapWrapper
              state={state}
              /** */
              userLocation={state.userLocation}
              setSearchCenter={setSearchCenter}
              searchRadius={state.searchRadius}
              /** */
              setBounds={setBounds}
              getRadiusMarkerCoordinates={getRadiusMarkerCoordinates}
              /* photoMarker*/
              triggerPhotoMarker={triggerPhotoMarker}
              disableTriggerPhotoMarker={disableTriggerPhotoMarker}
              /* radius marker */
              triggerPlotRadiusMarkerOnMap={triggerPlotRadiusMarkerOnMap}
              disableRadiusTrigger={disableRadiusTrigger}
              /* boundingBox Trigger */
              // triggerBoundingBox={triggerBoundingBox}
              // disableBoundingBoxTrigger={disableBoundingBoxTrigger}
              /* triggeer zoom to search area */
              triggerZoom={triggerZoom}
              disableZoom={disableZoom}
              /* trigger center search area on map */
              triggerCenter={triggerCenter}
              disableCenter={disableCenter}
              /**ScreenSize */
              screenWidth900px={screenWidth900px}
            />
          )}
          {!screenWidth900px && (
            <ControlPanelMobile
              setSearchRadius={setSearchRadius}
              searchFlikr={searchFlikr}
              loadingPhotos={loadingPhotos}
              zoomToSearchArea={zoomToSearchArea}
              centerSearchAreaOnMap={centerSearchAreaOnMap}
              sortMethod={sortMethod}
              handeSelectSortMethod={handeSelectSortMethod}
              handleTextQueryChange={handleTextQueryChange}
              searchText={searchText}
            />
          )}
        </section>

        <div ref={resultsRef}></div>
        {photos && (
          <ImageGrid
            photos={photos}
            responseDetails={responseDetails}
            direction={gridDirection}
            pinPhotoOnMap={pinPhotoOnMap}
            columns={2}
            setAppBarHide={setAppBarHide}
          />
        )}

        {responseDetails &&
          responseDetails.currentPage < responseDetails.totalPages && (
            <>
              {loadingPhotos && <LoadingBar />}
              <LoadMoreButton onClick={fetchNextPage} />
            </>
          )}
      </Appbar>
    </div>
  );
}

export default App;
