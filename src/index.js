import express from "express";
import {OK} from "http-status-codes";

const app = () => (req, res, next) => Promise
  .resolve()
  .then(
    () => {
      const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Login</title>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@toruslabs/torus-direct-web-sdk"></script>
    <!-- Don't use this in production: -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      const GOOGLE = "google";
      const FACEBOOK = "facebook";
      const REDDIT = "reddit";
      const DISCORD = "discord";
      const TWITCH = "twitch";
      const GITHUB = "github";
      const APPLE = "apple";
      const LINKEDIN = "linkedin";
      const TWITTER = "twitter";
      const WEIBO = "weibo";
      const LINE = "line";
      const EMAIL_PASSWORD = "email_password";
      const PASSWORDLESS = "passwordless";
      const HOSTED_EMAIL_PASSWORDLESS = "hosted_email_passwordless";
      const HOSTED_SMS_PASSWORDLESS = "hosted_sms_passwordless";

      const AUTH_DOMAIN = "https://torus-test.auth0.com";

      const verifierMap = {
        [GOOGLE]: {
          name: "Google",
          typeOfLogin: "google",
          clientId: "221898609709-obfn3p63741l5333093430j3qeiinaa8.apps.googleusercontent.com",
          verifier: "google-lrc",
        },
        [FACEBOOK]: { name: "Facebook", typeOfLogin: "facebook", clientId: "617201755556395", verifier: "facebook-lrc" },
        [REDDIT]: { name: "Reddit", typeOfLogin: "reddit", clientId: "YNsv1YtA_o66fA", verifier: "torus-reddit-test" },
        [TWITCH]: { name: "Twitch", typeOfLogin: "twitch", clientId: "f5and8beke76mzutmics0zu4gw10dj", verifier: "twitch-lrc" },
        [DISCORD]: { name: "Discord", typeOfLogin: "discord", clientId: "682533837464666198", verifier: "discord-lrc" },
        [EMAIL_PASSWORD]: {
          name: "Email Password",
          typeOfLogin: "email_password",
          clientId: "sqKRBVSdwa4WLkaq419U7Bamlh5vK1H7",
          verifier: "torus-auth0-email-password",
        },
        [PASSWORDLESS]: {
          name: "Passwordless",
          typeOfLogin: "passwordless",
          clientId: "P7PJuBCXIHP41lcyty0NEb7Lgf7Zme8Q",
          verifier: "torus-auth0-passwordless",
        },
        [APPLE]: { name: "Apple", typeOfLogin: "apple", clientId: "m1Q0gvDfOyZsJCZ3cucSQEe9XMvl9d9L", verifier: "torus-auth0-apple-lrc" },
        [GITHUB]: { name: "Github", typeOfLogin: "github", clientId: "PC2a4tfNRvXbT48t89J5am0oFM21Nxff", verifier: "torus-auth0-github-lrc" },
        [LINKEDIN]: { name: "Linkedin", typeOfLogin: "linkedin", clientId: "59YxSgx79Vl3Wi7tQUBqQTRTxWroTuoc", verifier: "torus-auth0-linkedin-lrc" },
        [TWITTER]: { name: "Twitter", typeOfLogin: "twitter", clientId: "A7H8kkcmyFRlusJQ9dZiqBLraG2yWIsO", verifier: "torus-auth0-twitter-lrc" },
        [WEIBO]: { name: "Weibo", typeOfLogin: "weibo", clientId: "dhFGlWQMoACOI5oS5A1jFglp772OAWr1", verifier: "torus-auth0-weibo-lrc" },
        [LINE]: { name: "Line", typeOfLogin: "line", clientId: "WN8bOmXKNRH1Gs8k475glfBP5gDZr9H1", verifier: "torus-auth0-line-lrc" },
        [HOSTED_EMAIL_PASSWORDLESS]: {
          name: "Hosted Email Passwordless",
          typeOfLogin: "jwt",
          clientId: "P7PJuBCXIHP41lcyty0NEb7Lgf7Zme8Q",
          verifier: "torus-auth0-passwordless",
        },
        [HOSTED_SMS_PASSWORDLESS]: {
          name: "Hosted SMS Passwordless",
          typeOfLogin: "jwt",
          clientId: "nSYBFalV2b1MSg5b2raWqHl63tfH3KQa",
          verifier: "torus-auth0-sms-passwordless",
        },
      };

      const loginToConnectionMap = {
        [EMAIL_PASSWORD]: { domain: AUTH_DOMAIN },
        [PASSWORDLESS]: { domain: AUTH_DOMAIN, login_hint: "" },
        [HOSTED_EMAIL_PASSWORDLESS]: { domain: AUTH_DOMAIN, verifierIdField: "name", connection: "", isVerifierIdCaseSensitive: false },
        [HOSTED_SMS_PASSWORDLESS]: { domain: AUTH_DOMAIN, verifierIdField: "name", connection: "" },
        [APPLE]: { domain: AUTH_DOMAIN },
        [GITHUB]: { domain: AUTH_DOMAIN },
        [LINKEDIN]: { domain: AUTH_DOMAIN },
        [TWITTER]: { domain: AUTH_DOMAIN },
        [WEIBO]: { domain: AUTH_DOMAIN },
        [LINE]: { domain: AUTH_DOMAIN },
      };

      const App = () => {
        const [sdk] = React.useState(
          new DirectWebSdk({
            baseUrl: "http://localhost:3000/serviceworker/",
            enableLogging: true,
            proxyContractAddress: "0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183", // details for test net
            network: "ropsten", // details for test net
          }),
        );
        React.useEffect(
          () => {
            sdk.init()
              .then(
                () => {
                  const selectedVerifier = "google";
                  const jwtParams = loginToConnectionMap[selectedVerifier] || {};
                  const { typeOfLogin, clientId, verifier } = verifierMap[selectedVerifier];
                  return sdk.triggerLogin({
                    typeOfLogin,
                    verifier,
                    clientId,
                    jwtParams,
                  });
                },
              )
              .then(console.log)
              .catch(console.error);
          },
          [],
        );
        return (
          <h1>Hello, world! Again!</h1>
        );
      };

      ReactDOM.render(<App />, document.getElementById('root'));
    </script>
  </body>
</html>
`.trim();
    return res
      .status(OK)
        .send(html);
    },
  )
  .catch(next);

export const torus = () => express()
  .get("/torus", app())
  .get("/serviceworker/sw.js", (req, res, next) => {
    res.setHeader('content-type', 'text/javascript')
    return res
      .status(OK)
      .send(
        `
/* eslint-disable */
function getScope() {
  return self.registration.scope;
}

self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", function (event) {
  try {
    const url = new URL(event.request.url);
    if (url.pathname.includes("redirect") && url.href.includes(getScope())) {
      event.respondWith(
        new Response(
          new Blob(
            [
              \`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Redirect</title>
    <style>
      * {
        box-sizing: border-box;
      }

      html,
      body {
        background: #fcfcfc;
        height: 100%;
        padding: 0;
        margin: 0;
      }

      .container {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      h1.title {
        font-size: 14px;
        color: #0f1222;
        font-family: "Roboto", sans-serif !important;
        margin: 0;
        text-align: center;
      }

      .spinner .beat {
        background-color: #0364ff;
        height: 12px;
        width: 12px;
        margin: 24px 2px 10px;
        border-radius: 100%;
        -webkit-animation: beatStretchDelay 0.7s infinite linear;
        animation: beatStretchDelay 0.7s infinite linear;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        display: inline-block;
      }

      .spinner .beat-odd {
        animation-delay: 0s;
      }

      .spinner .beat-even {
        animation-delay: 0.35s;
      }

      @-webkit-keyframes beatStretchDelay {
        50% {
          -webkit-transform: scale(0.75);
          transform: scale(0.75);
          -webkit-opacity: 0.2;
          opacity: 0.2;
        }

        100% {
          -webkit-transform: scale(1);
          transform: scale(1);
          -webkit-opacity: 1;
          opacity: 1;
        }
      }

      @keyframes beatStretchDelay {
        50% {
          -webkit-transform: scale(0.75);
          transform: scale(0.75);
          -webkit-opacity: 0.2;
          opacity: 0.2;
        }

        100% {
          -webkit-transform: scale(1);
          transform: scale(1);
          -webkit-opacity: 1;
          opacity: 1;
        }
      }

      @media (min-width: 768px) {
        h1.title {
          font-size: 14px;
        }
        p.info {
          font-size: 28px;
        }

        .spinner .beat {
          height: 12px;
          width: 12px;
        }
      }
    </style>
  </head>

  <body>
    <div id="message" class="container">
      <div class="spinner content" id="spinner">
        <div class="beat beat-odd"></div>
        <div class="beat beat-even"></div>
        <div class="beat beat-odd"></div>
      </div>
      <h1 class="title content" id="closeText" style="display: none;">You can close this window now</h1>
    </div>
    <script
      src="https://scripts.toruswallet.io/broadcastChannel_3_1_0.js"
      integrity="sha384-xZA9e8T2sQ3eBH6+D8PNECKbFOogWEHbtcYOFp1lB1bifyxBKzWRIHnk9ecVUse4"
      crossorigin="anonymous"
    ></script>
    <script>
      function storageAvailable(type) {
        var storage;
        try {
          storage = window[type];
          var x = "__storage_test__";
          storage.setItem(x, x);
          storage.removeItem(x);
          return true;
        } catch (e) {
          return (
            e &&
            // everything except Firefox
            (e.code === 22 ||
              // Firefox
              e.code === 1014 ||
              // test name field too, because code might not be present
              // everything except Firefox
              e.name === "QuotaExceededError" ||
              // Firefox
              e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
          );
        }
      }
      function showCloseText() {
        var closeText = document.getElementById("closeText");
        var spinner = document.getElementById("spinner");
        if (closeText) {
          closeText.style.display = "block";
        }
        if (spinner) {
          spinner.style.display = "none";
        }
      }
      var isLocalStorageAvailable = storageAvailable("localStorage");
      var isSessionStorageAvailable = storageAvailable("sessionStorage");
      // set theme
      let theme = "light";
      if (isLocalStorageAvailable) {
        var torusTheme = localStorage.getItem("torus-theme");
        if (torusTheme) {
          theme = torusTheme.split("-")[0];
        }
      }

      if (theme === "dark") {
        document.querySelector("body").style.backgroundColor = "#24252A";
      }
      var bc;
      var broadcastChannelOptions = {
        // type: 'localstorage', // (optional) enforce a type, oneOf['native', 'idb', 'localstorage', 'node'
        webWorkerSupport: false, // (optional) set this to false if you know that your channel will never be used in a WebWorker (increase performance)
      };
      var instanceParams = {};
      var preopenInstanceId = new URL(window.location.href).searchParams.get("preopenInstanceId");
      if (!preopenInstanceId) {
        document.getElementById("message").style.visibility = "visible";
        // in general oauth redirect
        try {
          var url = new URL(location.href);
          var hash = url.hash.substr(1);
          var hashParams = {};
          if (hash) {
            hashParams = hash.split("&").reduce(function (result, item) {
              var parts = item.split("=");
              result[parts[0]] = parts[1];
              return result;
            }, {});
          }
          var queryParams = {};
          for (var key of url.searchParams.keys()) {
            queryParams[key] = url.searchParams.get(key);
          }
          var error = "";
          try {
            if (Object.keys(hashParams).length > 0 && hashParams.state) {
              instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(hashParams.state)))) || {};
              if (hashParams.error) error = hashParams.error;
            } else if (Object.keys(queryParams).length > 0 && queryParams.state) {
              instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(queryParams.state)))) || {};
              if (queryParams.error) error = queryParams.error;
            }
          } catch (e) {
            console.error(e);
          }
          if (instanceParams.redirectToOpener) {
            // communicate to window.opener
            window.opener.postMessage(
              {
                channel: "redirect_channel_" + instanceParams.instanceId,
                data: {
                  instanceParams: instanceParams,
                  hashParams: hashParams,
                  queryParams: queryParams,
                },
                error: error,
              },
              "http://localhost:3000"
            );
          } else {
            // communicate via broadcast channel
            bc = new broadcastChannelLib.BroadcastChannel("redirect_channel_" + instanceParams.instanceId, broadcastChannelOptions);
            bc.postMessage({
              data: {
                instanceParams: instanceParams,
                hashParams: hashParams,
                queryParams: queryParams,
              },
              error: error,
            }).then(function () {
              bc.close();
              console.log("posted", {
                queryParams,
                instanceParams,
                hashParams,
              });
              setTimeout(function () {
                window.close();
                showCloseText();
              }, 5000);
            });
          }
        } catch (err) {
          console.error(err, "service worker error in redirect");
          bc && bc.close();
          window.close();
          showCloseText();
        }
      } else {
        // in preopen, awaiting redirect
        try {
          bc = new broadcastChannelLib.BroadcastChannel("preopen_channel_" + preopenInstanceId, broadcastChannelOptions);
          bc.onmessage = function (ev) {
            var { preopenInstanceId: oldId, payload, message } = ev.data;
            if (oldId === preopenInstanceId && payload && payload.url) {
              window.location.href = payload.url;
            } else if (oldId === preopenInstanceId && message === "setup_complete") {
              bc.postMessage({
                data: {
                  preopenInstanceId: preopenInstanceId,
                  message: "popup_loaded",
                },
              });
            }
            if (ev.error && ev.error !== "") {
              console.error(ev.error);
              bc.close();
            }
          };
        } catch (err) {
          console.error(err, "service worker error in preopen");
          bc && bc.close();
          window.close();
          showCloseText();
        }
      }
    </script>
  </body>
</html>
                        
${""}
  \`,
            ],
            { type: "text/html" }
          )
        )
      );
    }
  } catch (error) {
    console.error(error);
  }
});        
        `
      );
  })
  .get("/serviceworker/redirect.html", (req, res, next) => {
    return res
      .status(OK)
      .send(
        `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Redirect</title>
    <style>
      * {
        box-sizing: border-box;
      }

      html,
      body {
        background: #fcfcfc;
        height: 100%;
        padding: 0;
        margin: 0;
      }

      .container {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      h1.title {
        font-size: 14px;
        color: #0f1222;
        font-family: "Roboto", sans-serif !important;
        margin: 0;
        text-align: center;
      }

      .spinner .beat {
        background-color: #0364ff;
        height: 12px;
        width: 12px;
        margin: 24px 2px 10px;
        border-radius: 100%;
        -webkit-animation: beatStretchDelay 0.7s infinite linear;
        animation: beatStretchDelay 0.7s infinite linear;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        display: inline-block;
      }

      .spinner .beat-odd {
        animation-delay: 0s;
      }

      .spinner .beat-even {
        animation-delay: 0.35s;
      }

      @-webkit-keyframes beatStretchDelay {
        50% {
          -webkit-transform: scale(0.75);
          transform: scale(0.75);
          -webkit-opacity: 0.2;
          opacity: 0.2;
        }

        100% {
          -webkit-transform: scale(1);
          transform: scale(1);
          -webkit-opacity: 1;
          opacity: 1;
        }
      }

      @keyframes beatStretchDelay {
        50% {
          -webkit-transform: scale(0.75);
          transform: scale(0.75);
          -webkit-opacity: 0.2;
          opacity: 0.2;
        }

        100% {
          -webkit-transform: scale(1);
          transform: scale(1);
          -webkit-opacity: 1;
          opacity: 1;
        }
      }

      @media (min-width: 768px) {
        h1.title {
          font-size: 14px;
        }
        p.info {
          font-size: 28px;
        }

        .spinner .beat {
          height: 12px;
          width: 12px;
        }
      }
    </style>
  </head>

  <body>
    <div id="message" class="container">
      <div class="spinner content" id="spinner">
        <div class="beat beat-odd"></div>
        <div class="beat beat-even"></div>
        <div class="beat beat-odd"></div>
      </div>
      <h1 class="title content" id="closeText" style="display: none;">You can close this window now</h1>
    </div>
    <script
      src="https://scripts.toruswallet.io/broadcastChannel_3_1_0.js"
      integrity="sha384-xZA9e8T2sQ3eBH6+D8PNECKbFOogWEHbtcYOFp1lB1bifyxBKzWRIHnk9ecVUse4"
      crossorigin="anonymous"
    ></script>
    <script>
      function storageAvailable(type) {
        var storage;
        try {
          storage = window[type];
          var x = "__storage_test__";
          storage.setItem(x, x);
          storage.removeItem(x);
          return true;
        } catch (e) {
          return (
            e &&
            // everything except Firefox
            (e.code === 22 ||
              // Firefox
              e.code === 1014 ||
              // test name field too, because code might not be present
              // everything except Firefox
              e.name === "QuotaExceededError" ||
              // Firefox
              e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
          );
        }
      }
      function showCloseText() {
        var closeText = document.getElementById("closeText");
        var spinner = document.getElementById("spinner");
        if (closeText) {
          closeText.style.display = "block";
        }
        if (spinner) {
          spinner.style.display = "none";
        }
      }
      var isLocalStorageAvailable = storageAvailable("localStorage");
      var isSessionStorageAvailable = storageAvailable("sessionStorage");
      // set theme
      let theme = "light";
      if (isLocalStorageAvailable) {
        var torusTheme = localStorage.getItem("torus-theme");
        if (torusTheme) {
          theme = torusTheme.split("-")[0];
        }
      }

      if (theme === "dark") {
        document.querySelector("body").style.backgroundColor = "#24252A";
      }
      var bc;
      var broadcastChannelOptions = {
        // type: 'localstorage', // (optional) enforce a type, oneOf['native', 'idb', 'localstorage', 'node'
        webWorkerSupport: false, // (optional) set this to false if you know that your channel will never be used in a WebWorker (increase performance)
      };
      var instanceParams = {};
      var preopenInstanceId = new URL(window.location.href).searchParams.get("preopenInstanceId");
      if (!preopenInstanceId) {
        document.getElementById("message").style.visibility = "visible";
        // in general oauth redirect
        try {
          var url = new URL(location.href);
          var hash = url.hash.substr(1);
          var hashParams = {};
          if (hash) {
            hashParams = hash.split("&").reduce(function (result, item) {
              var parts = item.split("=");
              result[parts[0]] = parts[1];
              return result;
            }, {});
          }
          var queryParams = {};
          for (var key of url.searchParams.keys()) {
            queryParams[key] = url.searchParams.get(key);
          }
          var error = "";
          try {
            if (Object.keys(hashParams).length > 0 && hashParams.state) {
              instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(hashParams.state)))) || {};
              if (hashParams.error) error = hashParams.error;
            } else if (Object.keys(queryParams).length > 0 && queryParams.state) {
              instanceParams = JSON.parse(window.atob(decodeURIComponent(decodeURIComponent(queryParams.state)))) || {};
              if (queryParams.error) error = queryParams.error;
            }
          } catch (e) {
            console.error(e);
          }
          if (instanceParams.redirectToOpener) {
            // communicate to window.opener
            window.opener.postMessage(
              {
                channel: "redirect_channel_" + instanceParams.instanceId,
                data: {
                  instanceParams: instanceParams,
                  hashParams: hashParams,
                  queryParams: queryParams,
                },
                error: error,
              },
              "http://localhost:3000"
            );
          } else {
            // communicate via broadcast channel
            bc = new broadcastChannelLib.BroadcastChannel("redirect_channel_" + instanceParams.instanceId, broadcastChannelOptions);
            bc.postMessage({
              data: {
                instanceParams: instanceParams,
                hashParams: hashParams,
                queryParams: queryParams,
              },
              error: error,
            }).then(function () {
              bc.close();
              console.log("posted", {
                queryParams,
                instanceParams,
                hashParams,
              });
              setTimeout(function () {
                window.close();
                showCloseText();
              }, 5000);
            });
          }
        } catch (err) {
          console.error(err, "service worker error in redirect");
          bc && bc.close();
          window.close();
          showCloseText();
        }
      } else {
        // in preopen, awaiting redirect
        try {
          bc = new broadcastChannelLib.BroadcastChannel("preopen_channel_" + preopenInstanceId, broadcastChannelOptions);
          bc.onmessage = function (ev) {
            var { preopenInstanceId: oldId, payload, message } = ev.data;
            if (oldId === preopenInstanceId && payload && payload.url) {
              window.location.href = payload.url;
            } else if (oldId === preopenInstanceId && message === "setup_complete") {
              bc.postMessage({
                data: {
                  preopenInstanceId: preopenInstanceId,
                  message: "popup_loaded",
                },
              });
            }
            if (ev.error && ev.error !== "") {
              console.error(ev.error);
              bc.close();
            }
          };
        } catch (err) {
          console.error(err, "service worker error in preopen");
          bc && bc.close();
          window.close();
          showCloseText();
        }
      }
    </script>
  </body>
</html>
        `
      );
  });
