import React, { useReducer } from "react";

import rootReducer from "./rootReducer";
import StateContext from "./stateContext";
import DispatchContext from "./dispatchContext";

export default function Store(props) {
  const initialState = {
    mapLoaded: false,
    userLocation: null,
    searchRadius: 3,
    photos: null,
    filteredPhotos: null,
    hiddenPhotos: [],
    favorites: [],
    blockedUsers: []
  };

  const [state, dispatch] = useReducer(rootReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}
