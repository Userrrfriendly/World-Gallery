import React from "react";
import PhotoMarker_20 from "../../assets/PhotoMarker_20.svg";

/*When the Map component mounts the following happen:
 * the google maps callback is 'tied' to the window obj (componentDidMount())
 * a script with the google maps api is created and inserted at the bottom of the body (createGoogleApiScript)
 * the callback func fires (initMap) and initializes google maps
 * then initMap creates the default markers (addDefaultMarkers) and the default infowindow
 *** At this point the App is ready for user interaction
 */

const mapStyle = {
  width: "100vw",
  height: "75vh",
  border: "1px solid black",
  maxWidth: "100%",
  boxSizing: "border-box"
};
class Map extends React.Component {
  state = {
    // activeMarker: null,
    boundingBox: null,
    selectionMarker: null,
    pinndedPhotos: []
  };

  componentDidMount() {
    window.initMap = this.initMap;
    this.handleGoogleMapsError();
    this.createGoogleApiScript(this.state.userLocation);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("map updated");
    //when the user location changes pan the map to it
    //(either when the response comes from geoip-db or if the user sets it explicitly)

    if (prevProps.userLocation !== this.props.userLocation) {
      /**  even though the component has mounted and is currently in re-render(update) phase
       * window.map can be undefined (especially on first load where google.maps api is not cached and is not fully initialized)
       * so there is a slim chance that window.map.panTo will run before google.maps is fully loaded thus trowing an error
       * The following ugly code checks if google.maps is loaded before trying to zoom/add marker to the users location
       * each time the check results to false it retries after 10ms, when the waitingTrheshold (3seconds) runs out it gives up
       * (at this point google maps probably failed for some other reason, like network error, or auth problems...)
       */
      let waitingThreshold = 3000; //max number of milliseconds to wait for google.maps to initialize
      const mapReady = () => {
        if (waitingThreshold <= 0) {
          stopTimer();
        }
        if (window.map) {
          window.map.panTo(this.props.userLocation);
          this.addRadiusMarker(this.props.userLocation);
          stopTimer();
        } else {
          waitingThreshold -= 10;
        }
      };
      const timer = setInterval(mapReady, 10);
      const stopTimer = () => clearInterval(timer);
    }

    //this is for photos
    // if (this.props.setRadiusMarker) {
    //   this.pinPhotoMarkerOnMap(this.props.setRadiusMarker);
    //   this.props.disableAddMarker();
    // }
    // if (this.props.setRadiusMarker) {
    //   this.addRadiusMarker();
    //   this.props.disableAddMarker(this.props.setRadiusMarker);
    // }

    if (this.props.triggerPlotRadiusMarkerOnMap) {
      this.addRadiusMarker();
      this.props.disableRadiusTrigger();
    }
    if (this.props.triggerBoundingBox) {
      this.addPolygon();
      this.props.disableBoundingBoxTrigger();
    }
  }

  handleGoogleMapsError = () => {
    // google maps method for handling authentication errors
    // more on: https://developers.google.com/maps/documentation/javascript/events#auth-errors
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
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCzs3fKNRPknPJs8LaW9rsCvBxeY2QCJhg&v=3&callback=initMap";
    script.async = true;
    script.defer = true;
    script.onerror = function() {
      document.write("Error Loading Google Maps...");
    };
    body.insertBefore(script, body.lastElementChild);
  };

  initMap = () => {
    console.log("Google Maps API Loaded...");
    window.map = new window.google.maps.Map(
      document.getElementById("map-container"),
      {
        center: { lat: 48.80582620218145, lng: 2.1164958494489383 }, //paris, versailles
        zoom: 8,
        gestureHandling: "cooperative",
        mapTypeId: window.google.maps.MapTypeId.TERRAIN
      }
    );
    window.largeInfowindow = new window.google.maps.InfoWindow({
      maxWidth: 200
    });

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

  removeMarker = () => {
    if (this.state.selectionMarker) {
      this.state.selectionMarker.setMap(null);
      this.setState({ selectionMarker: null });
    }
  };

  removePolygon = () => {
    if (this.state.boundingBox) {
      this.state.boundingBox.setMap(null);
      this.setState({ boundingBox: null });
    }
  };

  addRadiusMarker = location => {
    if (this.state.selectionMarker) {
      this.removeMarker();
      this.props.getRadiusMarkerCoordinates(null);
    } else {
      //if a specific location is passed as arg, place the marker at that coords. If no args are passed use center of map
      const centerXY = location ? location : window.map.center.toJSON();
      //if marker/polygon already exists remove it
      this.removeMarker();
      this.removePolygon();

      let marker = new window.google.maps.Marker({
        position: centerXY,
        map: window.map,
        title: "Test",
        draggable: true,
        animation: window.google.maps.Animation.DROP
      });
      this.setState({ selectionMarker: marker });
      this.props.setBounds(null);
      this.props.getRadiusMarkerCoordinates(marker.getPosition().toJSON());
      window.marker = marker;
    }
  };

  pinPhotoMarkerOnMap = pin => {
    const customMarker = {
      url: PhotoMarker_20,
      scale: 0.1
    };

    let marker = new window.google.maps.Marker({
      position: pin.position,
      map: window.map,
      icon: customMarker,
      title: pin.title,
      animation: window.google.maps.Animation.DROP
    });

    window.map.panTo(marker.getPosition());

    this.setState(prevState => {
      const pins = prevState.pinndedPhotos;
      pins.push(marker);
      return { pinndedPhotos: pins };
    });

    marker.addListener("click", function() {
      window.map.panTo(this.getPosition());
      window.largeInfowindow.setContent("test");
      // window.map.setZoom(14);
      // window.map.openInfoWindow(marker, window.largeInfowindow);
      window.largeInfowindow.open(window.map, marker);
      // toggleBounce();
    });
    window.photoMarker = marker;

    // marker.addListener('click', function() {
    //   infowindow.open(map, marker);
    // });
  };

  render() {
    return (
      <div
        title="map"
        role="application"
        aria-label="Map with Landmarks and GeoTagged photos"
        id="map-container"
        style={mapStyle}
      ></div>
    );
  }
}

export default Map;
