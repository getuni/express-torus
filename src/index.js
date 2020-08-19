import React from "react";
import express from "express";
import {OK} from "http-status-codes";
import appRootPath from "app-root-path";
import {renderToString} from "react-dom/server";
import {compile} from "handlebars";
import {decode as atob} from "base-64";
import deepmerge from "deepmerge";
import fs from "fs";

import App from "./app/App";

const getBaseUrl = (req, scheme) => `${scheme}://${req.get("host")}`;

const app = ({
  scheme,
  serviceWorkerPath,
  torusPath,
  enableLogging,
  proxyContractAddress,
  network,
  verifierMap,
  loginToConnectionMap,
}) => (req, res, next) => Promise
  .resolve()
  .then(
    () => {
      const {query} = req;
      const {deepLinkUri, public: cert} = query;
      const baseUrl = `${getBaseUrl(req, scheme)}${serviceWorkerPath}`;
      const config = Object.freeze({
        baseUrl,
        enableLogging,
        proxyContractAddress,
        network,
        loginToConnectionMap,
        verifierMap,
        deepLinkUri: atob(deepLinkUri),
        cert: atob(cert),
      });
      const container = renderToString(
        <App
          config={config}
          isServerSide
          postMessageStream={null}
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
    <style>
      body { margin:0; }
    </style>
  </head>
  <body>
    <div id="container">{{{container}}}</div>
    <div id="root"></div>
    <script src="${torusPath}/app.js" charset="utf-8"></script>
    <script src="${torusPath}/vendor.js" charset="utf-8"></script>
    <script src="${torusPath}/root/app.js" charset="utf-8"></script>
    <script src="${torusPath}/root/vendor.js" charset="utf-8"></script>
  </body>
</html>
      `.trim();
      return res
        .status(OK)
        .send(compile(html)({container}));
    },
  )
  .catch(next);

const defaultOptions = {
  torusPath: "/torus",
  serviceWorkerPath: "/serviceworker",
  scheme: "http",
};

const replaceRedirect = ({ scheme }, path) => {
  const orig = fs.readFileSync(path, "utf8");
  return (req, res, next) => {
    const baseUrl = `${getBaseUrl(req, scheme)}`;
    const data = orig.replace("http://localhost:3000", baseUrl);
    return res.status(OK).send(data);
  };
};

export const torus = (options = defaultOptions) => {
  const opts = deepmerge(defaultOptions, options);
  const {verifierMap, torusPath, serviceWorkerPath} = opts;
  return express()
    .use(`${serviceWorkerPath}/redirect`, replaceRedirect(opts, `${appRootPath}/node_modules/@toruslabs/torus-direct-web-sdk/serviceworker/redirect.html`))
    .use(`${serviceWorkerPath}/sw.js`, replaceRedirect(opts, `${appRootPath}/node_modules/@toruslabs/torus-direct-web-sdk/serviceworker/sw.js`))
    .get(`${torusPath}/app.js`, (_, res) => res.status(OK).sendFile(appRootPath + '/node_modules/express-torus/dist/app.js'))
    .get(`${torusPath}/vendor.js`, (_, res) => res.status(OK).sendFile(appRootPath + '/node_modules/express-torus/dist/vendor.js'))
    .use(`${torusPath}`, app(opts));
};


