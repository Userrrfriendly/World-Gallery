import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  Suspense,
  lazy
} from "react";
import * as FlikrApi from "./requests/flikr";
import Skeleton from "@material-ui/lab/Skeleton";
import StateContext from "./context/stateContext";
import DispatchContext from "./context/dispatchContext";
import QueryContext from "./context/QueryContext/queryContext";
import {
  SET_USER_LOCATION,
  SET_PHOTOS,
  UPDATE_PHOTOS,
  ADD_IMG_TO_FAVORITES,
  REMOVE_IMG_FROM_FAVORITES,
  SET_MAP_LOADED,
  MAKE_TOAST
} from "./context/rootReducer";

import Appbar from "./components/appBar/appBar";
import ImageGrid from "./components/imageGrid/imageGrid";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import LoadMoreButton from "./components/controls/loadMoreBtn";
import LoadingBar from "./components/LoadingBar/loadingBar";
import ControlPanel from "./components/controlPanel/controlPanel";
import ControlPanelMobile from "./components/controlPanel/controlPanelMobile";
import FavoritesDialog from "./components/favorites/FavoritesDialog";
import { mapReady } from "./helpers/helpers";

import LightBoxHeader from "./components/lightboxComponents/lightboxHeader";
import LightBoxViewRenderer from "./components/lightboxComponents/lightboxViewRenderer";
import Carousel, { Modal, ModalGateway } from "react-images";
import { useMinScreenWidth } from "./helpers/CustomHooks/useMinScreenWidth";
import Toast from "./components/toast/toast";

import CarouselShowCase from "./components/CarouselShowCase/carouselShowCase";
import { useHistory, withRouter, Redirect } from "react-router-dom";

const MapWrapper = lazy(() => import("./components/map/mapContainer"));

const navButtonStyles = base => ({
  ...base,
  background: "rgba(255, 255, 255, 0.2)",
  "&:hover, &:active": {
    boxShadow: "0px 0px 11px 0px rgba(0,0,0,0.75)",
    background: "rgba(255, 255, 255, 0.3)"
  },
  "&:active": {
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.14)",
    transform: "scale(0.96)"
  }
});

const imagePositionerStyles = base => ({
  ...base,
  zIndex: "5500"
});
const blanketStyles = base => ({
  ...base,
  zIndex: "5000"
});

function App(props) {
  const store = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const queryStore = useContext(QueryContext);

  const smSceen = useMediaQuery("(max-width:450px)");

  /**Routing */
  let history = useHistory();

  /** Top user benefits (Auto Rotating Carousel) */
  const [carouselOpen, setCarouselOpen] = useState(true);
  const closeCarousel = () => setCarouselOpen(false);

  /** Favorites Dialog */
  const [openFavorites, setOpenFavorites] = useState(false);
  const handleOpenFavorites = () => {
    history.push("/favorites/");
    setOpenFavorites(true);
  };

  const handleCloseFavorites = () => {
    setOpenFavorites(false);
  };

  /**LightBox */
  /**explicitly hide appbar if the lightbox is open (prevents appbar overlay with image in lightbox) */

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightboxSinglePhoto = (event, { photo, index }) => {
    setCurrentImage(0);
    setViewerIsOpen({ photo });
    history.push("/img-carousel/");
  };

  const openLightbox = useCallback(
    (event, { photo, index }) => {
      setCurrentImage(index);
      setViewerIsOpen(true);
      // console.log(props.match.url);
      // console.log(props.match.path);
      // console.log(props.location);
      // console.log(props.location.pathname);
      console.log("history CHANGED RERENDERING APP");

      let path = "/";
      switch (props.location.pathname) {
        case "/":
          path = "/img-carousel/";
          break;
        case "/favorites/":
          path = "/favorites/img-carousel/";
          break;
        default:
          return;
      }
      history.push(path);
    },
    [history, props.location.pathname]
  );

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
    history.goBack();
    // alert("history go back!");
  };

  /** End LightBox */
  const setMapLoaded = () => {
    dispatch({
      type: SET_MAP_LOADED,
      mapLoaded: true
    });
  };

  /** If request is successfull window will zoom to resultsRef */
  const resultsRef = React.useRef(null);

  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const [responseDetails, setResponseDetails] = useState(null);

  const [gridDirection, setGridDirection] = useState("row");
  const toggleGridDirection = () => {
    setGridDirection(gridDirection === "row" ? "column" : "row");
  };

  /** Markers trigger */
  const [displayPhotoMarkers, setDisplayPhotoMarkers] = useState(true);
  const togglePhotoMarkerDisplay = useCallback(() => {
    setDisplayPhotoMarkers(!displayPhotoMarkers);
  }, [setDisplayPhotoMarkers, displayPhotoMarkers]);

  const [displayFavorites, setDisplayFavorites] = useState(true);
  const toggleFavorites = () => setDisplayFavorites(!displayFavorites);

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

  const searchFlikr = () => {
    console.log("fetching...");
    let searchParams;
    // switch (queryStore.searchMethod) {
    // case "EXTENTS":
    const bounds = window.map ? window.map.getBounds().toJSON() : "error";
    searchParams = {
      searchMethod: queryStore.searchMethod,
      minUploadDate: queryStore.minUploadDate,
      maxUploadDate: queryStore.maxUploadDate,
      minTakenDate: queryStore.minTakenDate,
      maxTakenDate: queryStore.maxTakenDate,
      resultsPerPage: queryStore.resultsPerPage,
      sortMethod: queryStore.sortMethod,
      searchText: queryStore.searchText,
      bounds
    };
    //     break;
    //   default:
    //     console.log("invalid searchMethod");
    //     return;
    // }

    setLoadingPhotos(true);
    FlikrApi.getPhotosByTitle(searchParams)
      .then(data => {
        setLoadingPhotos(false);
        // console.log(data);
        if (data.stat === "ok") {
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
        } else {
          switch (data.code) {
            /**Check the error code and respond with an appropriete notification */
            case 4:
              /**message:Not a valid bounding box --> Antimeridian Error */
              dispatch({
                type: MAKE_TOAST,
                message: `Your location search intersects with antimeridian!
                Make sure that the red vertical line is out of map extents`,
                variant: "error"
              });
              break;
            case 9999:
              /**message: Failed to fetch --> No Internet connection */
              dispatch({
                type: MAKE_TOAST,
                message: `Failed to fetch, please check your internet connection`,
                variant: "error"
              });
              break;
            default:
              /**Default returns any other flickr's API errors messages  */
              dispatch({
                type: MAKE_TOAST,
                message: data.message,
                variant: "error"
              });
          }
        }
      })
      .catch(error => {
        setLoadingPhotos(false);
        dispatch({
          type: MAKE_TOAST,
          message: error.message,
          variant: "error"
        });
      });
  };

  const fetchNextPage = () => {
    console.log("fetching next page...");

    const searchParams = {
      ...responseDetails,
      resultsPerPage: responseDetails.perPage
    };
    if (responseDetails.currentPage < responseDetails.totalPages) {
      searchParams.page = responseDetails.currentPage + 1;
    }
    // console.log(searchParams);
    setLoadingPhotos(true);

    FlikrApi.getPhotosByTitle(searchParams)
      .then(data => {
        setLoadingPhotos(false);

        setResponseDetails({
          ...data
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

  // useEffect(() => {
  //   //debugging only
  //   console.log(store);
  //   console.log(responseDetails); // IF RESPONSE DETAILS RETURNS ERROR THE APP CAN CRASH
  // }, [store, responseDetails]);

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
    const zoom = () => {
      window.map.panTo(location);
      window.map.setZoom(16);
    };
    mapReady(zoom);
  };

  const handleMyLocationClick = () => {
    if (store.userLocation) {
      zoomToLocation(store.userLocation);
    } else {
      /* if geoip-db call failed or if it was blocked by an add-blocker use native geolocation API */
      const success = position => {
        zoomToLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
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
      } else {
        alert("Sorry geolocation is not supported by your broweser.");
      }
    }
  };

  return (
    <div className="App">
      <Appbar
        photos={responseDetails ? responseDetails.totalPages : 0}
        toggleGridDirection={toggleGridDirection}
        gridDirection={gridDirection}
        searchFlikr={searchFlikr}
        handleMyLocationClick={handleMyLocationClick}
        togglePhotoMarkerDisplay={togglePhotoMarkerDisplay}
        toggleFavorites={toggleFavorites}
        displayPhotoMarkers={displayPhotoMarkers}
        displayFavorites={displayFavorites}
        handleOpenFavorites={handleOpenFavorites}
        {...props}
      >
        <section
          style={
            useMinScreenWidth(900)
              ? { display: "flex", height: "calc(100vh - 7px - 64px)" } //7px margins, 64appbar
              : {
                  display: "flex",
                  height: "calc(100vh - 7px - 64px )",
                  flexFlow: "column"
                }
          }
        >
          {useMinScreenWidth(900) && (
            <ControlPanel
              searchFlikr={searchFlikr}
              loadingPhotos={loadingPhotos}
              togglePhotoMarkerDisplay={togglePhotoMarkerDisplay}
              toggleFavorites={toggleFavorites}
              displayPhotoMarkers={displayPhotoMarkers}
              displayFavorites={displayFavorites}
              handleMyLocationClick={handleMyLocationClick}
            ></ControlPanel>
          )}
          {!useMinScreenWidth(900) && (
            <ControlPanelMobile
              searchFlikr={searchFlikr}
              loadingPhotos={loadingPhotos}
            />
          )}
          <Suspense fallback={<Skeleton variant="rect" />}>
            <MapWrapper
              setMapLoaded={setMapLoaded}
              photos={store.filteredPhotos}
              favorites={store.favorites}
              displayPhotoMarkers={displayPhotoMarkers}
              displayFavorites={displayFavorites}
              screenWidth900px={useMinScreenWidth(900)}
              openLightbox={openLightboxSinglePhoto}
            />
          </Suspense>
        </section>

        <div ref={resultsRef}></div>
        {store.filteredPhotos && (
          <ImageGrid
            photos={store.filteredPhotos}
            hiddenPhotos={store.hiddenPhotos}
            responseDetails={responseDetails}
            direction={smSceen ? "column" : gridDirection}
            imageToggleFavorites={imageToggleFavorites}
            openFavorites={openFavorites}
            openLightbox={openLightbox}
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
      <ModalGateway>
        {viewerIsOpen &&
          (history.location.pathname === "/img-carousel/" ||
            history.location.pathname === "/favorites/img-carousel/") && (
            <Modal
              onClose={closeLightbox}
              styles={{
                blanket: blanketStyles,
                positioner: imagePositionerStyles
              }}
            >
              <Carousel
                imageToggleFavorites={imageToggleFavorites}
                components={{
                  Header: LightBoxHeader,
                  View: LightBoxViewRenderer
                }}
                currentIndex={currentImage}
                views={
                  // if viewerIsOpen has a .photo property then open a single photo,
                  // else if favorites is open render favorites else render normal carousel
                  viewerIsOpen.photo
                    ? [
                        {
                          ...viewerIsOpen.photo,
                          srcset: viewerIsOpen.photo.srcSet,
                          caption: viewerIsOpen.photo.title
                        }
                      ]
                    : openFavorites
                    ? store.favorites.map(x => ({
                        ...x,
                        srcset: x.srcSet,
                        caption: x.title
                      }))
                    : store.filteredPhotos.map(x => ({
                        ...x,
                        srcset: x.srcSet,
                        caption: x.title
                      }))
                }
                styles={{
                  navigationPrev: navButtonStyles,
                  navigationNext: navButtonStyles
                }}
              />
            </Modal>
          )}
      </ModalGateway>
      {openFavorites &&
        (history.location.pathname === "/favorites/" ||
          history.location.pathname === "/favorites/img-carousel/") && (
          <FavoritesDialog
            openFavorites={openFavorites}
            handleCloseFavorites={handleCloseFavorites}
            responseDetails={responseDetails}
            imageToggleFavorites={imageToggleFavorites}
            openLightbox={openLightbox}
          />
        )}
      {carouselOpen && (
        <CarouselShowCase open={carouselOpen} closeCarousel={closeCarousel} />
      )}
      <Toast />
      {history.location.pathname.startsWith("/img-carousel/") &&
        !viewerIsOpen && <Redirect to="/" />}
      {history.location.pathname.startsWith("/favorites/") &&
        !openFavorites && <Redirect to="/" />}
    </div>
  );
}

export default withRouter(App);
