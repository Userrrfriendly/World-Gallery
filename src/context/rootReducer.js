export const SET_BOUNDING_BOX = "SET_BOUNDING_BOX";
export const SET_RADIUS_MARKER = "SET_RADIUS_MARKER";

const setBoundingBox = (action, state) => {
  return { ...state, boundingBox: action.boundingBox };
};

const setRadiusMarker = (action, state) => {
  return { ...state, radiusMarker: action.radiusMarker };
};

export const rootReducer = (state, action) => {
  switch (action.type) {
    case SET_BOUNDING_BOX:
      console.log(action.type);
      return setBoundingBox(action, state);
    case SET_RADIUS_MARKER:
      console.log(action.type);
      return setRadiusMarker(action, state);

    default:
      return state;
  }
};

export default rootReducer;
