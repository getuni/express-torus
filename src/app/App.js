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

const App = ({isServerSide, config}) => {
  const {
    baseUrl,
    enableLogging,
    proxyContractAddress,
    network,
    jwtParams,
    verify,
    deepLinkUri,
    cert,
  } = config;

  const [didInit, setDidInit] = useState(false);
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
    () => sdk
      .init({skipSw: false})
      .then(() => setDidInit(true))
      .catch(setError) && undefined,
    [sdk, setDidInit, isServerSide, setError],
  );

  const shouldTriggerLogin = useCallback(
    () => {
      if (didInit) {
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
                return `${deepLinkUri}?torus=${encodeURIComponent(JSON.stringify(encryptedData))}`;
              }
              return undefined;
            },
          )
          .catch(setError)
          .then(() => setLoading(false)) && undefined;
      }
      return Promise.reject(new Error(`Not yet initialized!`)) && undefined;
    },
    [didInit, sdk, verify, jwtParams, setError],
  );

  /* make auth visible to injected html */
  if (!isServerSide) {
    window.__TORUS_TRIGGER_AUTH__ = shouldTriggerLogin;
  }
 
  return null;
};
App.propTypes = {
  isServerSide: PropTypes.bool,
  config: PropTypes.shape({
    baseUrl: PropTypes.string.isRequired,
    proxyContractAddress: PropTypes.string.isRequired,
    network: PropTypes.string.isRequired,
    enableLogging: PropTypes.bool,
    verify: PropTypes.shape({}).isRequired,
    jwtParams: PropTypes.shape({}),
    deepLinkUri: PropTypes.string,
    cert: PropTypes.string.isRequired,
  }).isRequired,
};

App.defaultProps = {
  isServerSide: false,
  config: null,
};

export default App;
