import React from "react";

import heartMarker from "../../assets/loveinterestDark.png";
import photoMarker from "../../assets/photoDark_Blue.png";

const infoWindowContents = (data, callback) => {
  return `
  <h1 style="font-size:1rem;text-align:center;"> ${
    data.title ? data.title : "untitled photo"
  } </h1>
  <img id="image-info" title="${
    data.title ? data.title : "untitled photo"
  }" data-src=${data.src} data-photoid=${
    data.photoId
  } style="margin: 0 auto;display: block;cursor:pointer;" 
    src=${data.thumb} alt="${data.title}" >
  <a 
    title="open photo in flickr"
    style="background-color: #3f51b5;
    width: ${data.width_t}px;
    color: white;
    padding: 4px 5px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    text-align: center;
    margin: 0 auto 0.5rem ;
    display: block;" 
    href=https://www.flickr.com/photos/${data.owner}/${data.photoId}
    target="_blank">View in flickr
  </a>
  `;
};

/*When the Map component mounts the following happen:
 * the google maps callback is 'tied' to the window obj (componentDidMount())
 * a script with the google maps api is created and inserted at the bottom of the body (createGoogleApiScript)
 * the callback func fires (initMap) and initializes google maps
 * then initMap creates the default markers (addDefaultMarkers) and the default infowindow
 *** At this point the App is ready for user interaction
 */

const mapStyle = {
  width: "100vw",
  // height: "75vh",
  border: "1px solid black",
  maxWidth: "100%",
  boxSizing: "border-box",
  minHeight: "75vh",
  maxHeight: "100%"
};

class Map extends React.Component {
  state = {
    boundingBox: null,
    selectionMarker: null,
    photoMarkers: [],
    favorites: []
  };

  componentDidMount() {
    window.initMap = this.initMap;
    this.handleGoogleMapsError();
    this.createGoogleApiScript(this.state.userLocation);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props);
    /**SET RADIUS IF IT CHANGED */
    if (prevProps.searchRadius !== this.props.searchRadius) {
      this.searchCircle.setRadius(this.props.searchRadius * 1000);
    }
    console.log("map updated");

    if (prevProps.photos !== this.props.photos) {
      console.log("PHOTOS CHANGED - RERENDERING MARKERS");
      let photos = this.props.photos;
      this.state.photoMarkers.forEach(pin => pin.setMap(null));
      this.setState({ photoMarkers: [] });

      photos.forEach(photo => {
        if (!photo.isFavorite) {
          return this.createPhotoMarker(photo, this.props.displayPhotoMarkers);
        }
      });
    } else {
      console.log("PHOTOS DID NOT CHANGE - NO RERENDER FOR MARKERS");
    }

    if (prevProps.favorites !== this.props.favorites) {
      console.log("if prevProps favorites....");
      this.hideAllFavorites();
      this.setState({ favorites: [] });
      const showFavorites = this.props.displayFavorites;
      this.props.favorites.forEach(f => this.pinFavorite(f, showFavorites));
    }

    if (prevProps.displayPhotoMarkers !== this.props.displayPhotoMarkers) {
      console.log("SHOW/HIDE PHOTOMARKERS");
      this.props.displayPhotoMarkers
        ? this.showAllPhotoMarkers()
        : this.hideAllPhotoMarkers();
    }

    if (prevProps.displayFavorites !== this.props.displayFavorites) {
      console.log("SHOW/HIDE PHOTOMARKERS");
      this.props.displayFavorites
        ? this.showAllFavorites()
        : this.hideAllFavorites();
    }

    // if (prevProps.userLocation !== this.props.userLocation) {
    //   /**  even though the component has mounted and is currently in re-render(update) phase
    //    * window.map can be undefined (especially on first load where google.maps api is not cached and is not fully initialized)
    //    * so there is a slim chance that window.map.panTo will run before google.maps is fully loaded thus trowing an error
    //    * mapReady() checks if google.maps is loaded before trying to zoom  to the users location
    //    * each time the check results to false it retries after 10ms, when the waitingTrheshold (3seconds) runs out it gives up
    //    * (at this point google maps probably failed for some other reason, like network error, or auth problems...)
    //    */
    //   let waitingThreshold = 3000; //max number of milliseconds to wait for google.maps to initialize
    //   const mapReady = () => {
    //     if (waitingThreshold <= 0) {
    //       stopTimer();
    //     }
    //     if (window.map) {
    //       window.map.panTo(this.props.userLocation);
    //       // this.addSearchCircle(this.props.userLocation);
    //       window.map.setZoom(16);
    //       stopTimer();
    //     } else {
    //       waitingThreshold -= 10;
    //     }
    //   };
    //   const timer = setInterval(mapReady, 10);
    //   const stopTimer = () => clearInterval(timer);
    // }

    // if (this.props.triggerMapExtents) {
    //   window.
    //   this.props.disableMapExtentsTrigger();
    // }

    if (this.props.triggerPhotoMarker) {
      this.createPhotoMarker(
        this.props.triggerPhotoMarker,
        this.props.displayPhotoMarkers
      );
      this.props.disableTriggerPhotoMarker();
    }

    if (this.props.triggerCenter) {
      this.searchCircle.setCenter(window.map.getCenter().toJSON());
      this.props.disableCenter();
    }

    if (this.props.triggerZoom) {
      this.zoomToBounds();
      this.props.disableZoom();
    }

    // if (this.props.triggerBoundingBox) {
    //   this.addPolygon();
    //   this.props.disableBoundingBoxTrigger();
    // }
  }

  handleGoogleMapsError = () => {
    /* google maps method for handling authentication errors
     * more on: https://developers.google.com/maps/documentation/javascript/events#auth-errors*/
    window.gm_authFailure = () => {
      this.props.handleGoogleMapsError();
      document.querySelector(".gm-err-title").innerHTML =
        "Oops it seems there was a problem loading Google Maps!";
      document.querySelector(".gm-err-message").innerHTML =
        "Failed to authenticate Google Maps, please try again later";
    };
  };

  createGoogleApiScript = userLocation => {
    let body = window.document.querySelector("body");
    let script = window.document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCzs3fKNRPknPJs8LaW9rsCvBxeY2QCJhg&v=3&libraries=places&callback=initMap";
    script.async = true;
    script.defer = true;
    script.onerror = function() {
      document.write("Error Loading Google Maps...");
    };
    body.insertBefore(script, body.lastElementChild);
    script.addEventListener("load", () => {
      // console.log(window.google);
      this.props.setMapLoaded();
    });
  };

  initMap = () => {
    console.log("Google Maps API Loaded...");
    // const rome = {
    //   lat: 41.890384586382844,
    //   lng: 12.492241690388028
    // }; //Rome, colosseo
    const europe = { lat: 47.55241106676634, lng: 11.389968539500511 };

    window.map = new window.google.maps.Map(
      document.getElementById("map-container"),
      {
        center: europe,
        zoom: 5,
        gestureHandling: "cooperative",
        mapTypeId: window.google.maps.MapTypeId.TERRAIN,
        streetViewControl: false,
        fullscreenControl: false
      }
    );
    window.largeInfowindow = new window.google.maps.InfoWindow({
      maxWidth: 200
    });

    const attachImgOnClick = () => {
      const img = document.getElementById("image-info");
      const id = img.getAttribute("data-photoid");
      let photo = this.props.photos.find(img => img.photoId === id);
      if (!photo) {
        /**If photo is not found in filteredPhotos search for it in favorites */
        photo = this.props.favorites.find(img => img.photoId === id);
      }

      const openLightBox = this.props.openLightbox.bind(this, null, {
        index: 0,
        photo
      });

      img.onclick = openLightBox;
    };

    window.largeInfowindow.addListener("domready", attachImgOnClick);

    // this.addSearchCircle(rome);

    window.google.maps.event.addListenerOnce(window.map, "idle", () => {
      document.getElementsByTagName("iframe")[0].title = "Google Maps";
      /* https://stackoverflow.com/questions/49012240/google-maps-js-iframe-title 
            used to pass the (false possitive) accessibility audits */
    });
  };

  /*** ADDING POLYGON + add marker*/
  addPolygon = () => {
    const centerXY = window.map.center.toJSON();
    /** fixed size roughly 2x2 km box  **/
    // const km = 0.009;
    // const boundsStatic = {
    //   north: centerXY.lat + km,
    //   south: centerXY.lat - km,
    //   east: centerXY.lng + km,
    //   west: centerXY.lng - km
    // };

    /** dyniamic based on zoom level roughly 25% of map width/height  **/
    if (this.state.boundingBox) {
      this.removePolygon();
      this.props.setBounds(null);
      // this.setState({ polygon: null });
    } else {
      const zoomBounds = window.map.getBounds().toJSON();
      const northSouth = (zoomBounds.north - zoomBounds.south) / 5;
      const eastWest = (zoomBounds.east - zoomBounds.west) / 5;
      const boundsDynamic = {
        north: centerXY.lat + northSouth,
        south: centerXY.lat - northSouth,
        east: centerXY.lng + eastWest,
        west: centerXY.lng - eastWest
      };
      //if there is a polygon /or a marker on the screen remove it
      this.removePolygon();
      this.removeMarker();
      // Define a rectangle and set its editable property to true.
      this.rectangle = new window.google.maps.Rectangle({
        bounds: boundsDynamic,
        editable: true,
        draggable: true
      });
      this.rectangle.setMap(window.map);
      this.props.getRadiusMarkerCoordinates(null);
      this.props.setBounds(boundsDynamic);
      this.rectangle.addListener("bounds_changed", () =>
        this.props.setBounds(this.rectangle.bounds.toJSON())
      );
      this.setState({ boundingBox: this.rectangle });
      window.polygon = this.rectangle;
    }
  };

  removePolygon = () => {
    if (this.state.boundingBox) {
      this.state.boundingBox.setMap(null);
      this.setState({ boundingBox: null });
    }
  };

  createPhotoMarker = (pin, show) => {
    let marker = new window.google.maps.Marker({
      position: pin.geolocation,
      map: show ? window.map : null,
      icon: photoMarker,
      scaledSize: 0.5,
      title: pin.title,
      animation: window.google.maps.Animation.DROP,
      photoId: pin.photoId,
      color: "blue"
    });

    window.SETIMG = () => window.LASTMARKER.setIcon(heartMarker);
    window.RESET = () => {
      this.state.photoMarkers.forEach(pin => pin.setMap(null));
      this.setState({ photoMarkers: [] });
    };

    this.setState(prevState => {
      const pins = prevState.photoMarkers;
      pins.push(marker);
      return { photoMarkers: pins };
    });

    marker.addListener("click", function() {
      window.map.panTo(this.getPosition());

      window.largeInfowindow.setContent(infoWindowContents(pin));

      // window.map.setZoom(14);
      // window.map.openInfoWindow(marker, window.largeInfowindow);
      // toggleBounce();
      window.largeInfowindow.open(window.map, marker);
    });

    window.photoMarker = marker;
  };

  showAllPhotoMarkers = () => {
    const map = window.map;
    const markers = this.state.photoMarkers;
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  };

  hideAllPhotoMarkers = () => {
    const markers = this.state.photoMarkers;
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  };

  showAllFavorites = () => {
    const map = window.map;
    const markers = this.state.favorites;
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  };

  hideAllFavorites = () => {
    const markers = this.state.favorites;
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  };

  pinFavorite = (img, show) => {
    let marker = new window.google.maps.Marker({
      position: img.geolocation,
      map: show ? window.map : null,
      icon: heartMarker,
      title: img.title,
      animation: window.google.maps.Animation.DROP,
      photoId: img.photoId,
      favorite: true
    });

    this.setState(prevState => {
      const favorites = prevState.favorites;
      favorites.push(marker);
      return { favorites: favorites };
    });

    marker.addListener("click", function() {
      window.map.panTo(this.getPosition());
      window.largeInfowindow.setContent(infoWindowContents(img));
      window.largeInfowindow.open(window.map, marker);
    });
  };

  addSearchCircle = center => {
    this.searchCircle = new window.google.maps.Circle({
      strokeColor: "#0e2a99",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#64b1e8",
      fillOpacity: 0.35,
      map: window.map,
      center: center ? center : { lat: 48.8, lng: 2.29 },
      radius: this.props.searchRadius * 1000, //radius in store is in KM radius in maps is meters
      draggable: true
    });
    window.SEARCHRADIUS = this.searchCircle; //DEBUGGING ONLY

    /** a circle bound to the center of searchCircle,
     * its only purpose is to graphically represent searchCircle's center */
    this.centerSearchCircle = new window.google.maps.Circle({
      strokeColor: "#0e0047",
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: "#0e0047",
      fillOpacity: 0.35,
      map: window.map,
      center: this.searchCircle.center.toJSON(),
      radius: 10
    });

    // window.testCENTER = this.centerSearchRadius;

    this.searchCircle.addListener("drag", () => {
      this.centerSearchCircle.setCenter(this.searchCircle.center.toJSON());
      // console.log(this.searchRadius.center.toJSON());
    });

    this.searchCircle.addListener("dragend", () => {
      this.props.setSearchCenter(this.searchCircle.center.toJSON());
    });
    this.searchCircle.addListener("center_changed", () => {
      this.props.setSearchCenter(this.searchCircle.center.toJSON());
      this.centerSearchCircle.setCenter(this.searchCircle.center.toJSON());
    });
  };

  zoomToBounds = () => {
    const km = 0.009; //roughtly one km in degrees of lat/lng
    const center = this.searchCircle.getCenter().toJSON();
    const bounds = {
      north: center.lat + km * this.props.searchRadius,
      south: center.lat - km * this.props.searchRadius,
      east: center.lng + km * this.props.searchRadius,
      west: center.lng - km * this.props.searchRadius
    };
    console.log(bounds);
    window.map.fitBounds(bounds);
  };

  render() {
    return (
      <div
        role="application"
        aria-label="Map"
        id="map-container"
        style={
          this.props.screenWidth900px
            ? mapStyle
            : {
                ...mapStyle,
                minHeight: "50vh",
                flexGrow: "1"
              }
        }
      ></div>
    );
  }
}

export default React.memo(Map);
