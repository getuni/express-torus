import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import TorusSdk from "@toruslabs/torus-direct-web-sdk";
import {typeCheck} from "type-check";
import jsrsasign from "jsrsasign";

const shouldEncryptSensitiveData = (data, key) => {
  const { privateKey, ...extras } = data;
  return {
    ...extras,
    privateKey: jsrsasign.crypto.Cipher.encrypt(privateKey, key),
  };
};

// TODO: add startInLoadingState :)
const App = ({postMessageStream, isServerSide, config}) => {
  const {
    baseUrl,
    enableLogging,
    proxyContractAddress,
    loginToConnectionMap,
    verifierMap,
    network,
    deepLinkUri,
    cert,
  } = config;

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [sdk] = useState(
    new TorusSdk({
      baseUrl,
      enableLogging,
      proxyContractAddress,
      network,
    }),
  );

  const shouldPostMessage = useCallback(
    (data) => {
      /* react-native */
      if (window.ReactNativeWebView) {
        return window.ReactNativeWebView.postMessage(JSON.stringify(data));
      }
      /* browser */
      return top.postMessage(
        JSON.stringify(data),
        (window.location != window.parent.location) ? document.referrer: document.location,
      );
    },
    [],
  );

  useEffect(
    () => (async () => {

      if (isServerSide) return;

      try { const result = await sdk.init({skipSw: false}); }
      catch (e) {
        console.error(e);
        setError(e);
      }

    })() && undefined,
    [sdk, isServerSide, setError],
  );

  const shouldTriggerVerify = useCallback(
    async ({ typeOfLogin, verifier, clientId, jwtParams, queryParams, instanceParams, hashParams }) => {
      setLoading(true);
      const hash = Object.entries(hashParams)
        .map(
          ([k, v]) => {
            if (k === "state") {
              // XXX: Yuck.
              return [k, encodeURIComponent((encodeURIComponent(btoa(JSON.stringify(v)))))];
            }
            return [k, v];
          },
        )
        .map(([k, v]) => `${k}=${v}`)
        .join("&");

      const { instanceId: preopenInstanceId } = instanceParams;

      const queryParameters = { ...queryParams, preopenInstanceId };

      try {
        const data = await sdk.triggerLogin(
          {
            typeOfLogin,
            verifier,
            clientId,
            jwtParams,
            /* skip open; hit tor.us directly */
            hash,
            queryParameters,
          },
        );

        const encryptedData = await shouldEncryptSensitiveData(data, jsrsasign.KEYUTIL.getKey(cert));

        setSuccess(true);

        return shouldPostMessage({ type: "torus-auth", data: encryptedData });
      } catch (e) {
        setError(new Error(e));
      } finally {
        setLoading(false);
      }
    },
    [sdk, shouldPostMessage, setSuccess, setLoading, setError, cert],
  );

  if (!isServerSide) {
    /* TODO: This is a hack. Find a smarter way to do this.  */
    window.__REACT_TORUS_TRIGGER_VERIFY__ = shouldTriggerVerify;
  }

  const shouldTriggerLogin = useCallback(
    (selectedVerifier) => {
      const verify = verifierMap[selectedVerifier];
      const jwtParams = loginToConnectionMap[selectedVerifier];
      const {typeOfLogin, clientId, verifier} = verify;
      return Promise
        .resolve()
        .then(() => setLoading(true))
        .then(() => {
          const trigger = {typeOfLogin, verifier, clientId, jwtParams};
          // XXX: Sync the WebView to acknowledge the client type.
          shouldPostMessage({ type: "torus-trigger-auth", trigger });
          return sdk.triggerLogin(trigger);
        })
        .then(
          (data) => {
            if (enableLogging) {
              console.log(data);
            }
            return data;
          },
        )
        .then(data => shouldEncryptSensitiveData(data, jsrsasign.KEYUTIL.getKey(cert)))
        .then(
          (encryptedData) => {
            setSuccess(true);
            // XXX: Should we redirect to a deep link uri?
            if (typeCheck("String", deepLinkUri) && deepLinkUri.length > 0) {
              (!!enableLogging) && console.log(`Returning results via  "${deepLinkUri}".`);

              const q = deepLinkUri.includes("?") ? "&" : "?";
              return Promise.resolve()
                .then(() => window.location.href = `${deepLinkUri}${q}torus=${encodeURIComponent(JSON.stringify(encryptedData))}`);
            }

            (!!enableLogging) && console.log(`Returning results via window.postMessage().`);
            return shouldPostMessage({ type: "torus-auth", data: encryptedData });
          },
        )
        .catch((e) => {
          console.error(e);
          setError(e);
        })
        .then(() => setLoading(false)) && undefined;
    },
    [sdk, verifierMap, loginToConnectionMap, setError, setSuccess, enableLogging, shouldPostMessage, cert],
  );

  useEffect(
    () => {
      if (!isServerSide) {
        postMessageStream.on(
          "data",
          ({type, ...extras}) => {
            if (type === "login") {
              const{provider} = extras;
              return shouldTriggerLogin(provider);
            } else if (type === "loading-state") {
              /* ignore */
              return undefined;
            }
            return console.warn(`Encountered unexpected type, "${type}". This will be ignored.`);
          },
        ) && undefined
      }
    },
    [sdk, isServerSide, postMessageStream, shouldTriggerLogin, shouldTriggerVerify],
  );

  useEffect(
    () => {
      if (!isServerSide) {
        /* update the loading state */
        postMessageStream.write({ type: "loading-state", loading })
      }
    },
    [isServerSide, postMessageStream, loading],
  );

  return null;
};

App.propTypes = {
  postMessageStream: PropTypes.shape({}),
  isServerSide: PropTypes.bool,
  config: PropTypes.shape({
    baseUrl: PropTypes.string.isRequired,
    proxyContractAddress: PropTypes.string.isRequired,
    network: PropTypes.string.isRequired,
    enableLogging: PropTypes.bool,
    loginToConnectionMap: PropTypes.shape({}).isRequired,
    verifierMap: PropTypes.shape({}).isRequired,
    deepLinkUri: PropTypes.string,
    cert: PropTypes.string.isRequired,
  }).isRequired,
};

App.defaultProps = {
  postMessageStream: undefined,
  isServerSide: false,
  config: null,
};

export default App;
