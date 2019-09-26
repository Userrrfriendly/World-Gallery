export const SET_BOUNDING_BOX = "SET_BOUNDING_BOX";
export const SET_RADIUS_MARKER = "SET_RADIUS_MARKER";

export const SET_USER_LOCATION = "SET_USER_LOCATION";
export const SET_SEARCH_RADIUS = "SET_SEARCH_RADIUS";
export const SET_SEARCH_CENTER = "SET_SEARCH_CENTER";

const setBoundingBox = (action, state) => {
  return { ...state, boundingBox: action.boundingBox };
};

const setRadiusMarker = (action, state) => {
  return { ...state, radiusMarker: action.radiusMarker };
};

const setUserLocation = (action, state) => {
  return {
    ...state,
    userLocation: action.userLocation,
    searchCenter: action.userLocation
  };
};

const setSearchRadius = (action, state) => {
  return { ...state, searchRadius: action.searchRadius };
};

const setSearchCenter = (action, state) => {
  return { ...state, searchCenter: action.searchCenter };
};

export const rootReducer = (state, action) => {
  switch (action.type) {
    case SET_BOUNDING_BOX:
      console.log(action.type);
      return setBoundingBox(action, state);
    case SET_RADIUS_MARKER:
      console.log(action.type);
      return setRadiusMarker(action, state);
    //new ones
    case SET_USER_LOCATION:
      console.log(action.type);
      return setUserLocation(action, state);
    case SET_SEARCH_RADIUS:
      console.log(action.type);
      return setSearchRadius(action, state);
    case SET_SEARCH_CENTER:
      console.log(action.type);
      return setSearchCenter(action, state);
    default:
      return state;
  }
};

export default rootReducer;
