export const SET_USER_LOCATION = "SET_USER_LOCATION";
export const SET_PHOTOS = "SET_PHOTOS";
export const UPDATE_PHOTOS = "UPDATE_PHOTOS";
export const BLOCK_USER = "BLOCK_USER";
export const ADD_IMG_TO_FAVORITES = "ADD_IMG_TO_FAVORITES";
export const REMOVE_IMG_FROM_FAVORITES = "REMOVE_IMG_FROM_FAVORITES";
export const SET_MAP_LOADED = "SET_MAP_LOADED";

const setUserLocation = (action, state) => {
  return {
    ...state,
    userLocation: action.userLocation
  };
};

const setPhotos = (action, state) => {
  /* currently setPhotos resets blocked users (initial request) */
  let filteredPhotos = action.photos;

  /**
   * set isFavorite:true to any img returned from the response that is already in favorites
   * so there are no duplicate markers
   **/
  if (state.favorites.length > 0) {
    filteredPhotos = filteredPhotos.map(img => {
      return state.favorites.find(el => el.photoId === img.photoId)
        ? { ...img, isFavorite: true }
        : img;
    });
  }

  return {
    ...state,
    photos: action.photos,
    filteredPhotos,
    blockedUsers: [],
    hiddenPhotos: []
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
  let filteredPhotos = state.filteredPhotos.concat(newPhotosFiltered);

  if (state.favorites.length > 0) {
    filteredPhotos = filteredPhotos.map(img => {
      return state.favorites.find(el => el.photoId === img.photoId)
        ? { ...img, isFavorite: true }
        : img;
    });
  }

  const hiddenPhotos = state.hiddenPhotos.concat(newHiddenPhotos);
  const photos = state.photos.concat(action.photos);

  return { ...state, photos, filteredPhotos, hiddenPhotos };
};

const blockUser = (action, state) => {
  const updatedBlockedUsers = state.blockedUsers.concat(action.userId);
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

  const filteredPhotos = state.filteredPhotos.map(img => {
    return img.photoId === action.image.photoId
      ? { ...img, isFavorite: true }
      : img;
  });

  return { ...state, favorites, filteredPhotos };
};

const removeImgFromFavorites = (action, state) => {
  const favorites = [...state.favorites];

  const filteredIndex = state.filteredPhotos.findIndex(
    el => el.photoId === action.image.photoId
  );
  let filteredPhotos = [...state.filteredPhotos];
  if (filteredIndex !== -1) {
    filteredPhotos[filteredIndex].isFavorite = false;
  }

  const index = favorites.findIndex(
    img => img.photoId === action.image.photoId
  );

  if (index !== -1) favorites.splice(index, 1);
  return { ...state, favorites, filteredPhotos };
};

const setMapLoaded = (action, state) => {
  return { ...state, mapLoaded: action.mapLoaded };
};

export const rootReducer = (state, action) => {
  switch (action.type) {
    case SET_USER_LOCATION:
      console.log(action.type);
      return setUserLocation(action, state);

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
    case SET_MAP_LOADED:
      console.log(action.type);
      return setMapLoaded(action, state);
    default:
      return state;
  }
};

export default rootReducer;
