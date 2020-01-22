import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import CssBaseline from "@material-ui/core/CssBaseline";
import Store from "./context/store";
import QueryStore from "./context/QueryContext/queryStore";
// import { BrowserRouter } from "react-router-dom";
// without HashRouter hosting in gitHub Pages can be troublesome
import { HashRouter as BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Store>
      <QueryStore>
        <CssBaseline />
        <App />
      </QueryStore>
    </Store>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
