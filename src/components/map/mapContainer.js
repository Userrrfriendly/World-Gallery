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

/*When the Map component mounts the following happens:
 * the google maps callback is 'tied' to the window obj (componentDidMount())
 * a script with the google maps api is created and inserted at the bottom of the body (createGoogleApiScript)
 * the callback func fires (initMap) and initializes google maps
 * then initMap creates the default markers  and the default infowindow
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
    photoMarkers: [],
    favorites: []
  };

  componentDidMount() {
    window.initMap = this.initMap;
    this.handleGoogleMapsError();
    this.createGoogleApiScript();
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.props);
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
      // console.log("SHOW/HIDE PHOTOMARKERS");
      this.props.displayPhotoMarkers
        ? this.showAllPhotoMarkers()
        : this.hideAllPhotoMarkers();
    }

    if (prevProps.displayFavorites !== this.props.displayFavorites) {
      // console.log("SHOW/HIDE PHOTOMARKERS");
      this.props.displayFavorites
        ? this.showAllFavorites()
        : this.hideAllFavorites();
    }

    if (this.props.triggerPhotoMarker) {
      this.createPhotoMarker(
        this.props.triggerPhotoMarker,
        this.props.displayPhotoMarkers
      );
      this.props.disableTriggerPhotoMarker();
    }
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

  createGoogleApiScript = () => {
    let body = window.document.querySelector("body");
    let script = window.document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCzs3fKNRPknPJs8LaW9rsCvBxeY2QCJhg&v=3&libraries=places&callback=initMap";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      this.props.mapsErrorToast();
    };
    body.insertBefore(script, body.lastElementChild);
    script.addEventListener("load", () => {
      this.props.setMapLoaded();
    });
  };

  initMap = () => {
    console.log("Google Maps API Loaded...");
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
      //fires when user clicks on the thumbnail of an expanded marker
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

    /** ANTIMERIDIAN */
    var antimeridianCoords = [
      { lat: 90, lng: 180 },
      { lat: -90, lng: 180 }
    ];
    var antimeridianPath = new window.google.maps.Polyline({
      path: antimeridianCoords,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 0.9,
      strokeWeight: 12
    });

    antimeridianPath.setMap(window.map);

    window.antiMeridianInfo = new window.google.maps.InfoWindow({
      maxWidth: 200
    });
    window.antiMeridianInfo
      .setContent(`The red line that you just clicked is the the 180th meridian 
      (sometimes called antimeridian).
      Please make sure that the antimeridian is outside the screen when you make a request for photos.
      (pan the map to the left or right untill the red line is no longer in view)`);

    antimeridianPath.addListener("click", e => {
      window.antiMeridianInfo.setPosition(e.latLng);
      window.antiMeridianInfo.open(window.map);
    });
    /** END ANTIMERIDIAN */

    window.google.maps.event.addListenerOnce(window.map, "idle", () => {
      document.getElementsByTagName("iframe")[0].title = "Google Maps";
      /* https://stackoverflow.com/questions/49012240/google-maps-js-iframe-title 
      used to pass the (false possitive) accessibility audits */
      this.props.idb(); //populates favorites (and adds markers on the map) from indexedDb
    });
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

    // window.SETIMG = () => window.LASTMARKER.setIcon(heartMarker);
    // window.RESET = () => {
    //   this.state.photoMarkers.forEach(pin => pin.setMap(null));
    //   this.setState({ photoMarkers: [] });
    // };

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
