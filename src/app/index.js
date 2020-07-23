import "@babel/polyfill";

import React from "react";
import {hydrate} from "react-dom";

import App from "./App";

/* extern */
const config = Object.freeze(window.__REACT_APP_CONFIG__);
delete window.__REACT_APP_CONFIG__;

hydrate(
  <App config={config} isServerSide={false} />,
  document.getElementById("container"),
);
