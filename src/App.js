import React, { useState, useEffect, useContext, useCallback } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import * as FlikrApi from "./requests/flikr";
import MapWrapper from "./components/map/mapContainer";
import StateContext from "./context/stateContext";
import DispatchContext from "./context/dispatchContext";
import {
  SET_BOUNDING_BOX,
  // SET_RADIUS_MARKER,
  SET_USER_LOCATION,
  SET_SEARCH_CENTER,
  SET_SEARCH_RADIUS,
  SET_PHOTOS,
  UPDATE_PHOTOS,
  ADD_IMG_TO_FAVORITES,
  REMOVE_IMG_FROM_FAVORITES
} from "./context/rootReducer";

import Appbar from "./components/appBar/appBar";
import ImageGrid from "./components/imageGrid/imageGrid";

import LoadMoreButton from "./components/controls/loadMoreBtn";
import LoadingBar from "./components/LoadingBar/loadingBar";
import ControlPanel from "./components/controlPanel/controlPanel";
import ControlPanelMobile from "./components/controlPanel/controlPanelMobile";
// import { find as _find } from "lodash";

function App() {
  const store = useContext(StateContext);
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
  const handleTextQueryChange = (e, clearText) => {
    setSearchText(e.target.value);
  };
  const clearTextQuery = () => setSearchText("");

  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [triggerZoom, setTriggerZoom] = useState(false);
  const [triggerCenter, setTriggerCenter] = useState(false);

  const zoomToSearchArea = () => setTriggerZoom(true);
  const disableZoom = useCallback(() => setTriggerZoom(false), [
    setTriggerZoom
  ]);
  const centerSearchAreaOnMap = () => setTriggerCenter(true);
  const disableCenter = useCallback(() => setTriggerCenter(false), [
    setTriggerCenter
  ]);

  const [mapVisible, setMapVisible] = useState(true); //REFACTOR FOR MAP TO COLLAPSE (height:0) OR DELETE METHOD
  const [responseDetails, setResponseDetails] = useState(null);

  const [gridDirection, setGridDirection] = useState("row");
  const toggleGridDirection = () => {
    setGridDirection(gridDirection === "row" ? "column" : "row");
  };
  /**explicitly hide appbar if the lightbox is open */
  const [appBarHide, setAppBarHide] = useState(false);

  /** Triggers plot photo on map  */
  // const [triggerPhotoMarker, setTriggerPhotoMarker] = useState(false);
  // const disableTriggerPhotoMarker = () => setTriggerPhotoMarker(false);

  /** Markers trigger */
  const [displayPhotoMarkers, setDisplayPhotoMarkers] = useState(true);
  const togglePhotoMarkerDisplay = useCallback(() => {
    setDisplayPhotoMarkers(!displayPhotoMarkers);
  }, [setDisplayPhotoMarkers, displayPhotoMarkers]);

  const [displayFavorites, setDisplayFavorites] = useState(true);
  // const toggleFavorites = useCallback(() => {
  //   setDisplayFavorites(!displayFavorites);
  // }, [setDisplayFavorites, displayFavorites]);

  const toggleFavorites = () => setDisplayFavorites(!displayFavorites);

  // const addImgToFavorites = useCallback(
  //   img => {
  //     console.log("adding to favorites");
  //     dispatch({
  //       type: ADD_IMG_TO_FAVORITES,
  //       image: img
  //     });
  //   },
  //   [dispatch]
  // );

  const imageToggleFavorites = useCallback(
    (img, isFavorite) => {
      console.log(isFavorite);
      if (!isFavorite) {
        dispatch({
          type: ADD_IMG_TO_FAVORITES,
          image: img
        });
      } else {
        dispatch({
          type: REMOVE_IMG_FROM_FAVORITES,
          image: img
        });
      }
    },
    [dispatch]
  );

  /* triggerPlotRadiusMarkerOnMap allows calling methods from anywhere inside mapContainer */
  const [
    triggerPlotRadiusMarkerOnMap,
    setTtriggerPlotRadiusMarkerOnMap
  ] = useState(false);

  const disableRadiusTrigger = useCallback(
    () => setTtriggerPlotRadiusMarkerOnMap(false),
    [setTtriggerPlotRadiusMarkerOnMap]
  );
  /**Bounds */
  // const [triggerBoundingBox, setTriggerBoundingBox] = useState(false);
  // const pinBoundingBoxOnMap = () => setTriggerBoundingBox(true);
  // const disableBoundingBoxTrigger = () => setTriggerBoundingBox(false);
  const [triggerMapExtents, setTriggerMapExtents] = useState(false);
  const disableMapExtentsTrigger = useCallback(
    () => setTriggerMapExtents(false),
    [setTriggerMapExtents]
  );

  // const getMapExtents = () => {
  //   dispatch({
  //     type: SET_BOUNDING_BOX,
  //     bounds: window.map.getBounds().toJSON()
  //   });
  // };

  const toggleMap = () => {
    const prevState = mapVisible;
    setMapVisible(!prevState);
  };

  const searchFlikr = () => {
    console.log("fetching...");
    let searchParams;
    // if (store.boundingBox) {
    //   searchParams = { ...store.boundingBox, type: "boundingBox" };
    // } else if (store.radiusMarker) {
    //   searchParams = { ...store.radiusMarker, type: "radiusMarker" };
    // } else {
    //   searchParams = {
    //     ...store.radiusMarker,
    //     search: "Search String goes here"
    //   };
    // }
    switch (store.searchMethod) {
      case "CIRCLE":
        searchParams = {
          lat: store.searchCenter.lat,
          lng: store.searchCenter.lng,
          radius: store.searchRadius,
          searchMethod: store.searchMethod,
          resultsPerPage: store.resultsPerPage,
          minUploadDate: store.minUploadDate,
          maxUploadDate: store.maxUploadDate,
          sortMethod,
          searchText
        };
        break;
      case "EXTENTS":
        const bounds = window.map ? window.map.getBounds().toJSON() : "error";
        console.log(bounds);
        searchParams = {
          searchMethod: store.searchMethod,
          minUploadDate: store.minUploadDate,
          maxUploadDate: store.maxUploadDate,
          minTakenDate: store.minTakenDate,
          maxTakenDate: store.maxTakenDate,
          resultsPerPage: store.resultsPerPage,
          bounds,
          sortMethod,
          searchText
        };
        break;
      default:
        console.log("invalid searchMethod");
        return;
    }

    setLoadingPhotos(true);
    FlikrApi.getPhotosByTitle(searchParams)
      .then(data => {
        setLoadingPhotos(false);
        setResponseDetails({
          ...data
        });
        dispatch({
          type: SET_PHOTOS,
          photos: data.photos
        });

        /* if scrollIntoView is called syncronously there is a chance that the images are not loaded yet
         * thus the body is still the same height and the element simply cannot be scrolled to. instead:
         *  When the response is loaded wait 100ms for the body to resize (while image gallery loads),
         * then scroll to the results (an empty div right above the results was used in order to avoid forwardingRefs)         *
         */
        window.setTimeout(() => {
          resultsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
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
    // } else if (store.radiusMarker) {
    //   searchParams = { ...responseDetails.query };
    // }
    const searchParams = {
      ...responseDetails,
      resultsPerPage: responseDetails.perPage
    };
    if (responseDetails.currentPage < responseDetails.totalPages) {
      searchParams.page = responseDetails.currentPage + 1;
    }
    console.log(searchParams);
    setLoadingPhotos(true);

    FlikrApi.getPhotosByTitle(searchParams)
      .then(data => {
        setLoadingPhotos(false);

        setResponseDetails({
          ...data
          // ...responseDetails,
          // currentPage: data.currentPage,
          // totalPages: data.totalPages,
          // totalPhotos: data.totalPhotos,
          // perPage: data.perPage,
          // query: data.query
        });
        dispatch({
          type: UPDATE_PHOTOS,
          photos: data.photos
        });
      })
      .catch(error => {
        setLoadingPhotos(false);
      });
  };

  useEffect(() => {
    //debugging only
    console.log(store);
    console.log(responseDetails); // IF RESPONSE DETAILS RETURNS ERROR THE APP CAN CRASH
  }, [store, responseDetails]);

  useEffect(() => {
    //debugging only
    console.log(store.filteredPhotos);
  }, [store.filteredPhotos]);

  useEffect(
    () => {
      /*fetch user location when app mounts*/
      fetch("https://geoip-db.com/json/42e6a770-b3ac-11e9-80ca-c95181800da7")
        .then(res => res.json())
        .then(position => {
          dispatch({
            type: SET_USER_LOCATION,
            userLocation: { lat: position.latitude, lng: position.longitude }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // eslint-disable-next-line
    []
  );

  const zoomToLocation = location => {
    /** in case window.map is undefined (not loaded/initialized):
     * mapReady() checks if google.maps is loaded before trying to zoom to the given location
     * each time the check results to false it retries after 10ms, when the waitingTrheshold (3seconds) runs out it gives up
     * (at this point google maps probably failed for some other reason, like network error, or auth problems...)
     */
    let waitingThreshold = 3000; //max number of milliseconds to wait for google.maps to initialize
    const mapReady = () => {
      if (waitingThreshold <= 0) {
        stopTimer();
      }
      if (window.map) {
        window.map.panTo(location);
        window.map.setZoom(16);
        stopTimer();
      } else {
        waitingThreshold -= 10;
      }
    };
    const timer = setInterval(mapReady, 10);
    const stopTimer = () => clearInterval(timer);
  };

  const setBounds = useCallback(
    bounds => {
      dispatch({
        type: SET_BOUNDING_BOX,
        boundingBox: bounds
      });
    },
    [dispatch]
  );

  // const getRadiusMarkerCoordinates = marker => {
  //   dispatch({
  //     type: SET_RADIUS_MARKER,
  //     radiusMarker: marker
  //   });
  // };

  const setSearchCenter = useCallback(
    center => {
      dispatch({
        type: SET_SEARCH_CENTER,
        searchCenter: center
      });
    },
    [dispatch]
  );

  const setSearchRadius = radius => {
    dispatch({
      type: SET_SEARCH_RADIUS,
      searchRadius: radius
    });
  };

  // const mapPhotos = React.useCallback(() => {
  //   //removes any photos that are in favorites from the photos passed to the map to remove duplicate markers
  //   if (store.favorites.length > 0) {
  //     const photos = store.filteredPhotos.filter(img => {
  //       if (_find(store.favorites, el => el.photoId === img.photoId)) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     });
  //     return photos;
  //   } else {
  //     return store.filteredPhotos;
  //   }
  // }, [store.favorites, store.filteredPhotos]);

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
              clearTextQuery={clearTextQuery}
              searchText={searchText}
              zoomToLocation={zoomToLocation}
              togglePhotoMarkerDisplay={togglePhotoMarkerDisplay}
              toggleFavorites={toggleFavorites}
            ></ControlPanel>
          )}
          {/* {mapVisible && ()} */}
          <MapWrapper
            photos={store.mapPhotos}
            favorites={store.favorites}
            userLocation={store.userLocation}
            setSearchCenter={setSearchCenter}
            searchRadius={store.searchRadius}
            // /** */
            displayPhotoMarkers={displayPhotoMarkers}
            displayFavorites={displayFavorites}
            setBounds={setBounds}
            // /**triggerGetMapExtents */
            triggerMapExtents={triggerMapExtents}
            disableMapExtentsTrigger={disableMapExtentsTrigger}
            // /* photoMarker*/
            // triggerPhotoMarker={triggerPhotoMarker}
            // disableTriggerPhotoMarker={disableTriggerPhotoMarker}
            // /* radius marker */
            triggerPlotRadiusMarkerOnMap={triggerPlotRadiusMarkerOnMap}
            disableRadiusTrigger={disableRadiusTrigger}
            // /* boundingBox Trigger */
            // // triggerBoundingBox={triggerBoundingBox}
            // // disableBoundingBoxTrigger={disableBoundingBoxTrigger}
            // /* triggeer zoom to search area */
            triggerZoom={triggerZoom}
            disableZoom={disableZoom}
            // /* trigger center search area on map */
            triggerCenter={triggerCenter}
            disableCenter={disableCenter}
            // /**ScreenSize */
            screenWidth900px={screenWidth900px}
          />

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
        {store.filteredPhotos && (
          <ImageGrid
            photos={store.filteredPhotos}
            hiddenPhotos={store.hiddenPhotos}
            responseDetails={responseDetails}
            direction={gridDirection}
            // pinPhotoOnMap={pinPhotoOnMap}
            // addImgToFavorites={addImgToFavorites}
            imageToggleFavorites={imageToggleFavorites}
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
