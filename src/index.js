import React from "react";
import express from "express";
import {OK} from "http-status-codes";
import appRootPath from "app-root-path";
import {renderToString} from "react-dom/server";
import {compile} from "handlebars";

import App from "./app/App";

const app = () => (req, res, next) => Promise
  .resolve()
  .then(
    () => {
      const config = Object.freeze({});
      // TODO: pass children for custom render
      const container = renderToString(
        <App
          config={config}
        />);
      const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Torus Login</title>
    <script>
      /* extern */
      window.__REACT_APP_CONFIG__ = ${JSON.stringify(config)};
    </script>
  </head>
  <body>
    <div id="container">{{{container}}}</div>
    <script src="/app.js" charset="utf-8"></script>
    <script src="/vendor.js" charset="utf-8"></script>
  </body>
</html>
      `.trim();
      return res
        .status(OK)
        .send(compile(html)({container}));
    },
  )
  .catch(next);

export const torus = () => express()
  .use(express.static("public"))
  .get("/serviceworker/redirect.html", (_, res) => res.status(OK).sendFile(appRootPath + '/node_modules/@toruslabs/torus-direct-web-sdk/serviceworker/redirect.html'))
  .get("/serviceworker/sw.js", (_, res) => res.status(OK).sendFile(appRootPath + '/node_modules/@toruslabs/torus-direct-web-sdk/serviceworker/sw.js'))
  .get("/torus", app());
