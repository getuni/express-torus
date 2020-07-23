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
      const container = renderToString(<App />);
      const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Torus Login</title>
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

//      const html = `
//<!DOCTYPE html>
//<html>
//  <head>
//    <meta charset="UTF-8" />
//    <title>Login</title>
//    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
//    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
//    <script src="https://unpkg.com/@toruslabs/torus-direct-web-sdk"></script>
//    <!-- Don't use this in production: -->
//    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
//  </head>
//  <body>
//    <div id="root"></div>
//    <script type="text/babel">
//      const GOOGLE = "google";
//      const FACEBOOK = "facebook";
//      const REDDIT = "reddit";
//      const DISCORD = "discord";
//      const TWITCH = "twitch";
//      const GITHUB = "github";
//      const APPLE = "apple";
//      const LINKEDIN = "linkedin";
//      const TWITTER = "twitter";
//      const WEIBO = "weibo";
//      const LINE = "line";
//      const EMAIL_PASSWORD = "email_password";
//      const PASSWORDLESS = "passwordless";
//      const HOSTED_EMAIL_PASSWORDLESS = "hosted_email_passwordless";
//      const HOSTED_SMS_PASSWORDLESS = "hosted_sms_passwordless";
//
//      const AUTH_DOMAIN = "https://torus-test.auth0.com";
//
//      const verifierMap = {
//        [GOOGLE]: {
//          name: "Google",
//          typeOfLogin: "google",
//          clientId: "221898609709-obfn3p63741l5333093430j3qeiinaa8.apps.googleusercontent.com",
//          verifier: "google-lrc",
//        },
//        [FACEBOOK]: { name: "Facebook", typeOfLogin: "facebook", clientId: "617201755556395", verifier: "facebook-lrc" },
//        [REDDIT]: { name: "Reddit", typeOfLogin: "reddit", clientId: "YNsv1YtA_o66fA", verifier: "torus-reddit-test" },
//        [TWITCH]: { name: "Twitch", typeOfLogin: "twitch", clientId: "f5and8beke76mzutmics0zu4gw10dj", verifier: "twitch-lrc" },
//        [DISCORD]: { name: "Discord", typeOfLogin: "discord", clientId: "682533837464666198", verifier: "discord-lrc" },
//        [EMAIL_PASSWORD]: {
//          name: "Email Password",
//          typeOfLogin: "email_password",
//          clientId: "sqKRBVSdwa4WLkaq419U7Bamlh5vK1H7",
//          verifier: "torus-auth0-email-password",
//        },
//        [PASSWORDLESS]: {
//          name: "Passwordless",
//          typeOfLogin: "passwordless",
//          clientId: "P7PJuBCXIHP41lcyty0NEb7Lgf7Zme8Q",
//          verifier: "torus-auth0-passwordless",
//        },
//        [APPLE]: { name: "Apple", typeOfLogin: "apple", clientId: "m1Q0gvDfOyZsJCZ3cucSQEe9XMvl9d9L", verifier: "torus-auth0-apple-lrc" },
//        [GITHUB]: { name: "Github", typeOfLogin: "github", clientId: "PC2a4tfNRvXbT48t89J5am0oFM21Nxff", verifier: "torus-auth0-github-lrc" },
//        [LINKEDIN]: { name: "Linkedin", typeOfLogin: "linkedin", clientId: "59YxSgx79Vl3Wi7tQUBqQTRTxWroTuoc", verifier: "torus-auth0-linkedin-lrc" },
//        [TWITTER]: { name: "Twitter", typeOfLogin: "twitter", clientId: "A7H8kkcmyFRlusJQ9dZiqBLraG2yWIsO", verifier: "torus-auth0-twitter-lrc" },
//        [WEIBO]: { name: "Weibo", typeOfLogin: "weibo", clientId: "dhFGlWQMoACOI5oS5A1jFglp772OAWr1", verifier: "torus-auth0-weibo-lrc" },
//        [LINE]: { name: "Line", typeOfLogin: "line", clientId: "WN8bOmXKNRH1Gs8k475glfBP5gDZr9H1", verifier: "torus-auth0-line-lrc" },
//        [HOSTED_EMAIL_PASSWORDLESS]: {
//          name: "Hosted Email Passwordless",
//          typeOfLogin: "jwt",
//          clientId: "P7PJuBCXIHP41lcyty0NEb7Lgf7Zme8Q",
//          verifier: "torus-auth0-passwordless",
//        },
//        [HOSTED_SMS_PASSWORDLESS]: {
//          name: "Hosted SMS Passwordless",
//          typeOfLogin: "jwt",
//          clientId: "nSYBFalV2b1MSg5b2raWqHl63tfH3KQa",
//          verifier: "torus-auth0-sms-passwordless",
//        },
//      };
//
//      const loginToConnectionMap = {
//        [EMAIL_PASSWORD]: { domain: AUTH_DOMAIN },
//        [PASSWORDLESS]: { domain: AUTH_DOMAIN, login_hint: "" },
//        [HOSTED_EMAIL_PASSWORDLESS]: { domain: AUTH_DOMAIN, verifierIdField: "name", connection: "", isVerifierIdCaseSensitive: false },
//        [HOSTED_SMS_PASSWORDLESS]: { domain: AUTH_DOMAIN, verifierIdField: "name", connection: "" },
//        [APPLE]: { domain: AUTH_DOMAIN },
//        [GITHUB]: { domain: AUTH_DOMAIN },
//        [LINKEDIN]: { domain: AUTH_DOMAIN },
//        [TWITTER]: { domain: AUTH_DOMAIN },
//        [WEIBO]: { domain: AUTH_DOMAIN },
//        [LINE]: { domain: AUTH_DOMAIN },
//      };
//
//      const App = () => {
//        const [sdk] = React.useState(
//          new DirectWebSdk({
//            baseUrl: "http://localhost:3000/serviceworker/",
//            enableLogging: true,
//            proxyContractAddress: "0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183", // details for test net
//            network: "ropsten", // details for test net
//          }),
//        );
//        React.useEffect(
//          () => {
//            sdk.init()
//              .then(
//                () => {
//                  const selectedVerifier = "google";
//                  const jwtParams = loginToConnectionMap[selectedVerifier] || {};
//                  const { typeOfLogin, clientId, verifier } = verifierMap[selectedVerifier];
//                  return sdk.triggerLogin({
//                    typeOfLogin,
//                    verifier,
//                    clientId,
//                    jwtParams,
//                  });
//                },
//              )
//              .then(console.log)
//              .catch(console.error);
//          },
//          [],
//        );
//        return (
//          <h1>Hello, world! Again!</h1>
//        );
//      };
//
//      ReactDOM.render(<App />, document.getElementById('root'));
//    </script>
//  </body>
//</html>
//`.trim();
//    return res
//      .status(OK)
//        .send(html);
//    },
  )
  .catch(next);

export const torus = () => express()
  .use(express.static("public"))
  .get("/serviceworker/redirect.html", (_, res) => res.status(OK).sendFile(appRootPath + '/node_modules/@toruslabs/torus-direct-web-sdk/serviceworker/redirect.html'))
  .get("/serviceworker/sw.js", (_, res) => res.status(OK).sendFile(appRootPath + '/node_modules/@toruslabs/torus-direct-web-sdk/serviceworker/sw.js'))
  .get("/torus", app());
