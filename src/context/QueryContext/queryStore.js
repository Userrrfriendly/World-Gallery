import React, { useReducer } from "react";

import queryReducer from "./queryReducer";
import QueryContext from "./queryContext";
import DispatchQueryContext from "./dispatchQueryContext";

export default function Store(props) {
  const initialState = {
    searchMethod: "EXTENTS", // "CIRCLE" or "BOX"?
    resultsPerPage: 30,
    minUploadDate: false,
    maxUploadDate: false,
    minTakenDate: false,
    maxTakenDate: false,
    //
    searchRadius: 3,
    searchCenter: { lat: 48.80582620218145, lng: 2.1164958494489383 } //paris, versailles,
  };

  const [state, dispatch] = useReducer(queryReducer, initialState);

  return (
    <DispatchQueryContext.Provider value={dispatch}>
      <QueryContext.Provider value={state}>
        {props.children}
      </QueryContext.Provider>
    </DispatchQueryContext.Provider>
  );
}
