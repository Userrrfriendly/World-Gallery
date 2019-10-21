export const SET_MIN_UPLOAD_DATE = "SET_MIN_UPLOAD_DATE";
export const SET_MAX_UPLOAD_DATE = "SET_MAX_UPLOAD_DATE";
export const SET_MIN_TAKEN_DATE = "SET_MIN_TAKEN_DATE";
export const SET_MAX_TAKEN_DATE = "SET_MAX_TAKEN_DATE";
export const SET_MAX_RESULTS_PER_PAGE = "SET_MAX_RESULTS_PER_PAGE";

const setMinUploadDate = (action, state) => {
  return { ...state, minUploadDate: action.minUploadDate };
};

const setMaxUploadDate = (action, state) => {
  return { ...state, maxUploadDate: action.maxUploadDate };
};

const setMinTakenDate = (action, state) => {
  return { ...state, minTakenDate: action.minTakenDate };
};

const setMaxTakenDate = (action, state) => {
  return { ...state, maxTakenDate: action.maxTakenDate };
};

const setResultsPerPage = (action, state) => {
  return {
    ...state,
    resultsPerPage: action.resultsPerPage
  };
};

export const queryReducer = (state, action) => {
  switch (action.type) {
    case SET_MAX_RESULTS_PER_PAGE:
      console.log(action.type);
      return setResultsPerPage(action, state);
    // case SET_USER_LOCATION:
    //   console.log(action.type);
    //   return setUserLocation(action, state);
    // case SET_SEARCH_RADIUS:
    //   console.log(action.type);
    //   return setSearchRadius(action, state);
    // case SET_SEARCH_CENTER:
    //   console.log(action.type);
    //   return setSearchCenter(action, state);

    case SET_MIN_UPLOAD_DATE:
      console.log(action.type);
      return setMinUploadDate(action, state);
    case SET_MAX_UPLOAD_DATE:
      console.log(action.type);
      return setMaxUploadDate(action, state);
    case SET_MIN_TAKEN_DATE:
      console.log(action.type);
      return setMinTakenDate(action, state);
    case SET_MAX_TAKEN_DATE:
      console.log(action.type);
      return setMaxTakenDate(action, state);

    default:
      return state;
  }
};

export default queryReducer;
