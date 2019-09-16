import React from "react";
// import * as FlickrAPI from "../../requests/flikr";
// import "./css/map.css";
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
    polygon: null,
    selectionMarker: null,
    pinndedPhotos: []
  };

  componentDidMount() {
    window.initMap = this.initMap;
    this.handleGoogleMapsError();
    this.createGoogleApiScript();
  }

  componentDidUpdate() {
    console.log("map updated");
    if (this.props.addMarker) {
      this.pinPhotoMarkerOnMap(this.props.addMarker);
      this.props.disableAddMarker();
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

  createGoogleApiScript = () => {
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
        center: { lat: 36.436178, lng: 27.74009 },
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
    this.props.setSelectionMarker(null);
    this.props.setBounds(boundsDynamic);
    this.rectangle.addListener("bounds_changed", () =>
      this.props.setBounds(this.rectangle.bounds.toJSON())
    );
    this.setState({ polygon: this.rectangle });
    window.polygon = this.rectangle;
  };

  removeMarker = () => {
    if (this.state.selectionMarker) {
      this.state.selectionMarker.setMap(null);
      this.setState({ selectionMarker: null });
    }
  };

  removePolygon = () => {
    if (this.state.polygon) {
      this.state.polygon.setMap(null);
      this.setState({ polygon: null });
    }
  };

  addMarker = () => {
    const centerXY = window.map.center.toJSON();
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
    this.props.setSelectionMarker(marker.getPosition().toJSON());
    window.marker = marker;
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
      <>
        <button onClick={this.addPolygon}>ADD POLYGON</button>
        <button onClick={this.addMarker}>ADD Marker</button>

        <div
          title="map"
          role="application"
          aria-label="Map with Landmarks and GeoTagged photos"
          id="map-container"
          style={mapStyle}
        ></div>
      </>
    );
  }
}

export default Map;
