import React from "react";
import * as FlickrAPI from "../../requests/flikr";
// import "./css/map.css";
import PhotoMarker_20 from "../../assets/PhotoMarker_20.svg";

/*When the Map component mounts the following happen:
 * the google maps callback is 'tied' to the window obj (componentDidMount())
 * a script with the google maps api is created and inserted at the bottom of the body (createGoogleApiScript)
 * the callback func fires (initMap) and initializes google maps
 * then initMap creates the default markers (addDefaultMarkers) and the default infowindow
 *** At this point the App is ready for user interaction
 */

const Rhodes = {
  title: "Rhodes",
  location: { lat: 36.203525, lng: 27.947093 }
};

const mapStyle = {
  width: "100vw",
  height: "75vh",
  border: "1px solid black",
  maxWidth: "100%",
  boxSizing: "border-box"
};

class Map extends React.Component {
  state = {
    activeMarker: null,
    polygon: null,
    selectionMarker: null
  };

  componentDidMount() {
    window.initMap = this.initMap;
    this.handleGoogleMapsError();
    this.createGoogleApiScript();
  }

  componentDidUpdate() {
    console.log("map updated");
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
    // this.addDefaultMarkers();
  };

  /*** ADDING POLYGON + add marker*/
  addPolygon = () => {
    const centerXY = window.map.center.toJSON();
    /** fixed size roughly 2x2 km box  **/

    const km = 0.009;
    const boundsStatic = {
      north: centerXY.lat + km,
      south: centerXY.lat - km,
      east: centerXY.lng + km,
      west: centerXY.lng - km
    };
    console.log(boundsStatic);
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

    // var bounds = {
    //   north: 44.599,
    //   south: 44.49,
    //   east: -78.443,
    //   west: -78.649
    // };

    //if there is a polygon on the screen remove it
    this.removePolygon();
    // Define a rectangle and set its editable property to true.
    var rectangle = new window.google.maps.Rectangle({
      bounds: boundsDynamic,
      editable: true,
      draggable: true
    });
    rectangle.setMap(window.map);
    this.setState({ polygon: rectangle });
    window.polygon = rectangle;
  };

  removeMarker = () => {
    if (this.state.selectionMarker) {
      this.state.selectionMarker.setMap(null);
    }
  };

  removePolygon = () => {
    if (this.state.polygon) {
      this.state.polygon.setMap(null);
    }
  };

  addMarker = () => {
    const centerXY = window.map.center.toJSON();
    //if marker already exists remove it
    this.removeMarker();

    let marker = new window.google.maps.Marker({
      position: centerXY,
      map: window.map,
      title: Rhodes.title,
      draggable: true,
      animation: window.google.maps.Animation.DROP
    });
    this.setState({ selectionMarker: marker });
    window.marker = marker;
    // let marker = new window.google.maps.Marker({
    //   position: Rhodes.location,
    //   // icon: customMarker,
    //   geoPhotosMarkers: true,
    //   map: window.map,
    //   animation: window.google.maps.Animation.DROP
    //   // id: photo_id,
    //   // src: srcUrl,
    //   // photoTitle: title
    // });

    // let marker = new window.google.maps.Marker({
    //   position: defaultLocations[i].location,
    //   title: defaultLocations[i].title,
    //   defaultMarker: true,
    //   map: window.map,
    //   animation: window.google.maps.Animation.DROP,
    //   id: i
    // });
  };
  /*** END ADDING POLYGON */

  // addDefaultMarkers = () => {
  //   let markers = [];
  //   const defaultLocations = this.props.getDefaultLocations();
  //   const mapInstance = this;
  //   let bounds = new window.google.maps.LatLngBounds();

  //   // The following group uses the location array to create an array of markers on initMap.
  //   for (let i = 0; i < defaultLocations.length; i++) {
  //     let marker = new window.google.maps.Marker({
  //       position: defaultLocations[i].location,
  //       title: defaultLocations[i].title,
  //       defaultMarker: true,
  //       map: window.map,
  //       animation: window.google.maps.Animation.DROP,
  //       id: i
  //     });
  //     markers.push(marker);
  //     bounds.extend(defaultLocations[i].location);
  //     // Create an onclick event to open an infowindow for each marker.
  //     marker.addListener("click", function() {
  //       window.map.panTo(this.getPosition());
  //       window.map.setZoom(12);
  //       mapInstance.getMarkerDetails(this, window.largeInfowindow);
  //     });
  //   }
  //   window.map.fitBounds(bounds);
  //   this.props.changeStateAll(markers);
  // };

  getMarkerDetails = (marker, infoWindow) => {
    /* this func sends requests to Wikipedia (to get the description text for the infoWindow) 
            && Flickr to get the array of availiable photos.
            If the current marker has already made a succeful call to an API it wont repeat the call twice
            and simply skips to  openInfoWindow()
        */

    const checkDescription = "Error. failed to fetch data from wikipedia";
    const mapInstance = this;
    const promisesToResolve = [];

    let flickerPromise = FlickrAPI.getPhotosByTitle(marker).then(arr => {
      return FlickrAPI.flickrUrlConstructor(arr);
    });
    let wikiPromise = this.getWikiText(marker);

    if (!marker.urls || marker.urls.error) {
      // console.log('pushing flickrPromise')
      promisesToResolve.push(flickerPromise);
    }
    if (!marker.description || marker.description === checkDescription) {
      // console.log('pushing wikiPromise')
      promisesToResolve.push(wikiPromise);
    }
    Promise.all(promisesToResolve)
      .then(r => {
        if (r[0]) {
          marker.urls = r[0];
        }
        if (r[1]) {
          marker.description = r[1].description;
          marker.intro = r[1].intro;
          marker.error = r[1].error;
        }
        return marker;
      })
      .then(re => {
        return mapInstance.openInfoWindow(marker, infoWindow);
      });
  };

  getWikiText = marker => {
    /* this makes an API call to wikipedia and retrieves the first paragraph of the page with the given title(marker location name)
            Since The first paragraph of wiki can be too much info for our infowindow it slices the response and keeps only the first sentence.
            The return value is an obj based on witch the specific marker will be updated (marker.intro, marker.description, marker.error)  
        */
    let resultText = {
      intro: "",
      description: "",
      error: false
    };
    return fetch(
      `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=1&explaintext=1&origin=*&titles=${marker.title}`
    )
      .then(response => {
        return response.json();
      })
      .catch(error => {
        console.log(error);
        resultText.intro = "Error. failed to fetch data from wikipedia";
        resultText.description = "Error. failed to fetch data from wikipedia";
        resultText.error = true;
      })
      .then(myJson => {
        if (!resultText.error) {
          const wikiPageObj = myJson.query.pages;
          const wikiPageObjKeys = Object.keys(wikiPageObj);
          Object.keys(wikiPageObj).length === 1 && wikiPageObjKeys[0] !== "-1"
            ? (resultText.description = wikiPageObj[wikiPageObjKeys[0]].extract)
            : (resultText.description = `Sorry no Wikipedia entry about ${marker.title}.`);
          resultText.intro = resultText.description.slice(
            0,
            resultText.description.indexOf(".") + 1
          );
        }
        return resultText;
      });
  };

  openInfoWindow = (marker, infoWindow) => {
    // Opens the infowindow with a description from Wikipedia and a random image from Flickr from the specific location
    if (this.state.activeMarker) {
      this.state.activeMarker.setAnimation(null);
      this.setState({
        activeMarker: null
      });
    }
    this.setState({
      activeMarker: marker
    });

    marker.setAnimation(window.google.maps.Animation.BOUNCE);

    if (infoWindow.marker !== marker) {
      if (marker.defaultMarker) {
        //The following code block runs if a default marker was clicked:
        const randomImage = urlsArray => {
          if (urlsArray) {
            return Math.floor(Math.random() * urlsArray.length);
          }
        };
        const flickrResponse = m => {
          if (m.urls.error) {
            return `<strong>Failed to get data from Flickr</strong>`;
          } else if (m.urls.default.length === 0) {
            return `<strong>Sorry, Flickr didn't find any images with the #${m.title} tag.</strong>`;
          } else {
            const currentRandomImage = randomImage(marker.urls.thumbNail);
            const photoTitle = marker.urls.title[currentRandomImage][0];
            const alt = marker.title + ", " + photoTitle;
            return `<img 
                                id="image-info" 
                                tabindex="0"
                                data-img-id=${
                                  marker.urls.thumbNail[currentRandomImage][1]
                                } 
                                alt="${alt}" src=${
              marker.urls.thumbNail[currentRandomImage][0]
            }>
                                <button id="add-geo-tag" 
                                title="Plot photo on the map" 
                                data-img-id=${
                                  marker.urls.thumbNail[currentRandomImage][1]
                                }
                                data-img-title="${photoTitle}">Plot photo on the map
                                </button>`;
          }
        };
        infoWindow.marker = marker;
        infoWindow.setContent(
          `<div class=info-window>
                    <h4>${marker.title}</h4>
                    <p class='marker-intro'>${
                      marker.intro
                    }<span class='wiki-ref'>(Wikipedia excerpt)</span></p>
                    <section>
                    ${flickrResponse(marker)}
                    </section>
                    </div>`
        );
        //the else if deals with markers created by the user (plotted flickr images)
      } else if (marker.geoPhotosMarkers) {
        infoWindow.marker = null;
        infoWindow.setContent(
          `<div class=info-window>
                      <h4>${"Image Title: " + marker.photoTitle}</h4>
                      <img id="image-info" alt="${marker.photoTitle}" src=${
            marker.src
          }>
                      </div>`
        );
      }

      infoWindow.open(window.map, marker);
      infoWindow.addListener("closeclick", () => {
        marker.setAnimation(null);
        infoWindow.marker = null;
        this.setState({
          activeMarker: null
        });
      });
    }

    document.querySelector(".info-window").addEventListener("click", e => {
      if (e.target.id === "image-info") {
        this.props.imageClick(e);
      } else if (e.target.id === "add-geo-tag") {
        const photoID = e.target.getAttribute("data-img-id");
        const srcUrl = document.getElementById("image-info").src;
        const title = document
          .getElementById("add-geo-tag")
          .getAttribute("data-img-title");
        this.addGeoTagMarker(photoID, srcUrl, title);
      }
    });
  };

  addGeoTagMarker = (photo_id, srcUrl, title) => {
    const mapInstance = this;
    const customMarker = {
      // url: 'PhotoMarker_20.svg', //should work both on production && development but importing the image seems to be the best practice...
      url: PhotoMarker_20,
      scale: 0.1
    };
    FlickrAPI.getPhotoGeoLocation(photo_id).then(res => {
      const location = res;
      let marker = new window.google.maps.Marker({
        position: location,
        icon: customMarker,
        geoPhotosMarkers: true,
        map: window.map,
        animation: window.google.maps.Animation.DROP,
        id: photo_id,
        src: srcUrl,
        photoTitle: title
      });

      window.map.panTo(marker.getPosition());
      marker.addListener("click", function() {
        window.map.panTo(this.getPosition());
        window.map.setZoom(14);
        mapInstance.openInfoWindow(marker, window.largeInfowindow);
      });
      this.props.plotPhotoOnMap(marker); //updates App state
    });
  };

  render() {
    return (
      <>
        <button onClick={this.addPolygon}>ADD POLYGON</button>
        <button onClick={this.addMarker}>ADD Marker</button>
        {/* <button onClick={this.addMarker}>Marker on Click</button> */}

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
