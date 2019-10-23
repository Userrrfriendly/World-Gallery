import React, { useReducer } from "react";

import queryReducer from "./queryReducer";
import QueryContext from "./queryContext";
import DispatchQueryContext from "./dispatchQueryContext";

export default function Store(props) {
  const initialState = {
    /** currently no other searchMethod is implemented,
     * "CIRCLE" or "BOX" could be used in the future */
    searchMethod: "EXTENTS",
    resultsPerPage: 30,
    minUploadDate: false,
    maxUploadDate: false,
    minTakenDate: false,
    maxTakenDate: false,
    sortMethod: "date-posted-desc",
    searchText: ""
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
