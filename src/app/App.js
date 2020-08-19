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

  useEffect(
    () => (async () => {
      console.log('did call use effect');

      if (isServerSide) return;

      console.log('not server side');

      try {
        console.warn("about to init...");
        const result = await sdk.init({skipSw: false});
        console.log("did init successfully");
      }
      catch (e) {
        console.warn("did error on init");
        console.error(e);
        setError(e);
      }
    })() && undefined,
    [sdk, isServerSide, setError],
  );

  const shouldTriggerLogin = useCallback(
    (selectedVerifier) => {
      const verify = verifierMap[selectedVerifier];
      const jwtParams = loginToConnectionMap[selectedVerifier];
      const {typeOfLogin, clientId, verifier} = verify;
      return Promise
        .resolve()
        .then(() => setLoading(true))
        .then(() => sdk.triggerLogin({typeOfLogin, verifier, clientId, jwtParams}))
        .then(data => shouldEncryptSensitiveData(data, jsrsasign.KEYUTIL.getKey(cert)))
        .then(
          (encryptedData) => {
            // XXX: Should we redirect to a deep link uri?
            if (typeCheck("String", deepLinkUri) && deepLinkUri.length > 0) {
              // TODO: use a more robust method for url query parameters
              const q = deepLinkUri.includes("?") ? "&" : "?";
              return Promise.resolve()
                .then(() => setSuccess(true))
                .then(() => window.location.href = `${deepLinkUri}${q}torus=${encodeURIComponent(JSON.stringify(encryptedData))}`);
            }
            return undefined;
          },
        )
        .catch((e) => {
          console.warn('got an error with sdk');
          console.error(e);
          setError(e);
        })
        .then(() => setLoading(false)) && undefined;
    },
    [sdk, verifierMap, loginToConnectionMap, setError, setSuccess],
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
            }
            return console.warn(`Encountered unexpected type, "${type}". This will be ignored.`);
          },
        ) && undefined
      }
    },
    [isServerSide, postMessageStream, shouldTriggerLogin],
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
