import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import TorusSdk from "@toruslabs/torus-direct-web-sdk";

const App = ({isServerSide, config}) => {
  const {
    baseUrl,
    enableLogging,
    proxyContractAddress,
    network,
    jwtParams,
    verify,
  } = config;

  const [error, setError] = useState(null);
  const [didInit, setDidInit] = useState(false);

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

  const shouldPostMessage = useCallback(
    (e) => {
      // https://github.com/react-native-community/react-native-webview/
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        return window.ReactNativeWebView.postMessage(e);
      }
      console.warn('not posting message', e);
      return undefined;
    },
    [],
  );

  const shouldTriggerLogin = useCallback(
    () => {
      if (didInit) {
        const {typeOfLogin, clientId, verifier} = verify;
        return Promise
          .resolve()
          .then(
            () => sdk.triggerLogin({
              typeOfLogin,
              verifier,
              clientId,
              jwtParams,
            }),
          )
          .then((userData) => {
            // TODO: make configurable
            if (!isServerSide) {
              return shouldPostMessage(userData);
            }
            return undefined;
          })
          .catch(setError) && undefined;
      }
      return Promise.reject(new Error(`Not yet initialized!`)) && undefined;
    },
    [didInit, sdk, verify, jwtParams, setError, shouldPostMessage],
  );
  return (
    <div>
      {(!error) ? (
        <>
          {(!didInit) ? (
            <span
              children="Loading..."
            />
          ) : (
            <button
              onClick={() => shouldTriggerLogin()}
              children="Open login."
            />
          )}
        </>
      ) : (
        <span
          children={error.toString()}
        />
      )}
    </div>
  );
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
  }).isRequired,
};

App.defaultProps = {
  isServerSide: false,
  config: null,
};

export default App;
