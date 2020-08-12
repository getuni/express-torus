import "@babel/polyfill";

import React from "react";
import {hydrate} from "react-dom";
import PostMessageStream from "post-message-stream";

import App from "./App";

/* extern */
const config = Object.freeze(window.__REACT_APP_CONFIG__);
delete window.__REACT_APP_CONFIG__;

const postMessageStream = new PostMessageStream({
  name: "express-torus@provider",
  target: "express-torus@consumer",
});

hydrate(
  <App
    config={config}
    isServerSide={false}
    postMessageStream={postMessageStream}
  />,
  document.getElementById("container"),
);
