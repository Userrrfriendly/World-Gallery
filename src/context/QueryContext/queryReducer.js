export const SET_MIN_UPLOAD_DATE = "SET_MIN_UPLOAD_DATE";
export const SET_MAX_UPLOAD_DATE = "SET_MAX_UPLOAD_DATE";
export const SET_MIN_TAKEN_DATE = "SET_MIN_TAKEN_DATE";
export const SET_MAX_TAKEN_DATE = "SET_MAX_TAKEN_DATE";
export const SET_MAX_RESULTS_PER_PAGE = "SET_MAX_RESULTS_PER_PAGE";
export const SET_SEARCH_METHOD_SORTING = "SET_SEARCH_METHOD_SORTING";
export const SET_SEARCH_TEXT = "SET_SEARCH_TEXT";

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

const setSearchMethodSorting = (action, state) => {
  return { ...state, sortMethod: action.payload };
};

const setSearchText = (action, state) => {
  return { ...state, searchText: action.payload };
};

export const queryReducer = (state, action) => {
  switch (action.type) {
    case SET_MAX_RESULTS_PER_PAGE:
      console.log(action.type);
      return setResultsPerPage(action, state);
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
    case SET_SEARCH_METHOD_SORTING:
      console.log(action.type);
      return setSearchMethodSorting(action, state);
    case SET_SEARCH_TEXT:
      console.log(action.type);
      return setSearchText(action, state);

    default:
      return state;
  }
};

export default queryReducer;
