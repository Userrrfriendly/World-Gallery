export const SET_BOUNDING_BOX = "SET_BOUNDING_BOX";
export const SET_SELECTION_MARKER = "SET_SELECTION_MARKER";

const setBoundingBox = (action, state) => {
  return { ...state, boundingBox: action.boundingBox };
};

const selectionMarker = (action, state) => {
  return { ...state, selectionMarker: action.selectionMarker };
};

export const rootReducer = (state, action) => {
  switch (action.type) {
    case SET_BOUNDING_BOX:
      console.log(action.type);
      return setBoundingBox(action, state);
    case SET_SELECTION_MARKER:
      console.log(action.type);
      return selectionMarker(action, state);

    default:
      return state;
  }
};

export default rootReducer;
