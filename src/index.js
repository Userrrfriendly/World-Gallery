import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import CssBaseline from "@material-ui/core/CssBaseline";
import Store from "./context/store";
import QueryStore from "./context/QueryContext/queryStore";

ReactDOM.render(
  <Store>
    <QueryStore>
      <CssBaseline />
      <App />
    </QueryStore>
  </Store>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
