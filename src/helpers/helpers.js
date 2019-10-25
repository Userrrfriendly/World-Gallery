/** in case window.map is undefined (not loaded/initialized):
 * mapWait() checks if google.maps is loaded before trying to access the window.map object
 * each time the check results to false it retries after 10ms, when the waitingTrheshold (3seconds) runs out it gives up
 * (at this point google maps probably failed for some other reason, like network error, or auth problems...)
 */
export const mapReady = cb => {
  let waitingThreshold = 3000; //max number of milliseconds to wait for google.maps to initialize

  const mapWait = () => {
    if (waitingThreshold <= 0) {
      stopTimer();
      // alert("google maps cannot be loaded!"); display some error
    }
    if (window.map) {
      cb();
      stopTimer();
    } else {
      // console.log("waiting for maps....");
      waitingThreshold -= 10;
    }
  };
  const timer = setInterval(mapWait, 10);
  const stopTimer = () => clearInterval(timer);
};

export const checkBoundsArea = bounds => {
  // returns the area of map extents in sq km...
  const boundsPath = [];
  boundsPath.push(new window.google.maps.LatLng(bounds.south, bounds.west));
  boundsPath.push(new window.google.maps.LatLng(bounds.south, bounds.east));
  boundsPath.push(new window.google.maps.LatLng(bounds.north, bounds.east));
  boundsPath.push(new window.google.maps.LatLng(bounds.north, bounds.west));

  // return window.google.maps.geometry.spherical.computeArea(boundsPath) > 3 624 538 762 249;
  return (
    (
      window.google.maps.geometry.spherical.computeArea(boundsPath) /
      (1000 * 1000)
    ).toFixed(2) + " sq km"
  );
};
