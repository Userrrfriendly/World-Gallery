export const SET_BOUNDING_BOX = "SET_BOUNDING_BOX";
export const SET_RADIUS_MARKER = "SET_RADIUS_MARKER";

export const SET_USER_LOCATION = "SET_USER_LOCATION";
export const SET_SEARCH_RADIUS = "SET_SEARCH_RADIUS";
export const SET_SEARCH_CENTER = "SET_SEARCH_CENTER";
export const SET_PHOTOS = "SET_PHOTOS";
export const UPDATE_PHOTOS = "UPDATE_PHOTOS";
export const BLOCK_USER = "BLOCK_USER";

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

const setPhotos = (action, state) => {
  /* currently setPhotos resets blocked users (initial request) */
  return {
    ...state,
    photos: action.photos,
    filteredPhotos: action.photos,
    blockedUsers: [],
    hiddenPhotos: []
  };
};

const updatePhotos = (action, state) => {
  /** updatePhotos will expand the previous query of photos (previous results + new results) */
  const newPhotosFiltered = action.photos.filter(
    photo => !state.blockedUsers.includes(photo.owner)
  );
  const newHiddenPhotos = action.photos.filter(photo =>
    state.blockedUsers.includes(photo.owner)
  );
  const filteredPhotos = state.filteredPhotos.concat(newPhotosFiltered);
  const hiddenPhotos = state.hiddenPhotos.concat(newHiddenPhotos);
  const photos = state.photos.concat(action.photos);

  return { ...state, photos, filteredPhotos, hiddenPhotos };
};

const blockUser = (action, state) => {
  const updatedBlockedUsers = state.blockedUsers.concat(action.userId);
  // const filteredPhotos = state.filteredPhotos.concat(newPhotosFiltered);
  const filteredPhotos = state.filteredPhotos.filter(
    photo => !updatedBlockedUsers.includes(photo.owner)
  );
  const hiddenPhotos = state.photos.filter(photo =>
    updatedBlockedUsers.includes(photo.owner)
  );
  return {
    ...state,
    blockedUsers: updatedBlockedUsers,
    filteredPhotos,
    hiddenPhotos
  };
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
    case SET_PHOTOS:
      console.log(action.type);
      return setPhotos(action, state);
    case UPDATE_PHOTOS:
      console.log(action.type);
      return updatePhotos(action, state);
    case BLOCK_USER:
      console.log(action.type);
      return blockUser(action, state);
    default:
      return state;
  }
};

export default rootReducer;
