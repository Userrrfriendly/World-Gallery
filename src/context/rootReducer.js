import { find as _find } from "lodash";
export const SET_BOUNDING_BOX = "SET_BOUNDING_BOX";
// export const SET_RADIUS_MARKER = "SET_RADIUS_MARKER";

export const SET_USER_LOCATION = "SET_USER_LOCATION";
export const SET_SEARCH_RADIUS = "SET_SEARCH_RADIUS";
export const SET_SEARCH_CENTER = "SET_SEARCH_CENTER";
export const SET_PHOTOS = "SET_PHOTOS";
export const UPDATE_PHOTOS = "UPDATE_PHOTOS";
export const BLOCK_USER = "BLOCK_USER";
export const ADD_IMG_TO_FAVORITES = "ADD_IMG_TO_FAVORITES";
export const REMOVE_IMG_FROM_FAVORITES = "REMOVE_IMG_FROM_FAVORITES";
export const SET_MIN_UPLOAD_DATE = "SET_MIN_UPLOAD_DATE";
export const SET_MAX_UPLOAD_DATE = "SET_MAX_UPLOAD_DATE";
export const SET_MIN_TAKEN_DATE = "SET_MIN_TAKEN_DATE";
export const SET_MAX_TAKEN_DATE = "SET_MAX_TAKEN_DATE";

const setBoundingBox = (action, state) => {
  return { ...state, boundingBox: action.boundingBox };
};

// const setRadiusMarker = (action, state) => {
//   return { ...state, radiusMarker: action.radiusMarker };
// };

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
  const filteredPhotos = action.photos;
  let mapPhotos = action.photos;
  /** filter out any favorite photos so there are no duplicate markers  */
  if (state.favorites.length > 0) {
    mapPhotos = mapPhotos.filter(img => {
      if (_find(state.favorites, el => el.photoId === img.photoId)) {
        return false;
      } else {
        return true;
      }
    });

    console.log(mapPhotos);
  }

  return {
    ...state,
    photos: action.photos,
    filteredPhotos,
    blockedUsers: [],
    hiddenPhotos: [],
    mapPhotos
  };
};

const updatePhotos = (action, state) => {
  /** updatePhotos will expand the previous query of photos (previous results + new results) */
  /**One for each sounds better... if true go to newFiltered if false go to newHidden */
  const newPhotosFiltered = action.photos.filter(
    photo => !state.blockedUsers.includes(photo.owner)
  );
  const newHiddenPhotos = action.photos.filter(photo =>
    state.blockedUsers.includes(photo.owner)
  );
  const filteredPhotos = state.filteredPhotos.concat(newPhotosFiltered);

  let mapPhotos = state.mapPhotos;
  let newMapPhotos = [...action.photos];
  if (state.favorites.length > 0) {
    newMapPhotos = newMapPhotos.filter(img => {
      if (_find(state.favorites, el => el.photoId === img.photoId)) {
        return false;
      } else {
        return true;
      }
    });
  }

  mapPhotos = mapPhotos.concat(newMapPhotos);
  const hiddenPhotos = state.hiddenPhotos.concat(newHiddenPhotos);
  const photos = state.photos.concat(action.photos);

  return { ...state, photos, filteredPhotos, hiddenPhotos, mapPhotos };
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

const addImgToFavorites = (action, state) => {
  const favorites = state.favorites.concat(action.image);
  let mapPhotos = state.mapPhotos;
  if (favorites.length > 0) {
    mapPhotos = mapPhotos.filter(img => {
      if (_find(favorites, el => el.photoId === img.photoId)) {
        return false;
      } else {
        return true;
      }
    });
    console.log(mapPhotos);
  }
  return { ...state, favorites, mapPhotos };
};

const removeImgFromFavorites = (action, state) => {
  const favorites = [...state.favorites];
  const index = favorites.indexOf(action.image);
  if (index !== -1) favorites.splice(index, 1);
  return { ...state, favorites };
};

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

export const rootReducer = (state, action) => {
  switch (action.type) {
    case SET_BOUNDING_BOX:
      console.log(action.type);
      return setBoundingBox(action, state);
    // case SET_RADIUS_MARKER:
    //   console.log(action.type);
    //   return setRadiusMarker(action, state);
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
    case ADD_IMG_TO_FAVORITES:
      console.log(action.type);
      return addImgToFavorites(action, state);
    case REMOVE_IMG_FROM_FAVORITES:
      console.log(action.type);
      return removeImgFromFavorites(action, state);
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

export default rootReducer;
