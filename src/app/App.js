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
    dangerouslySetInnerHTML,
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
          .then(results => (window.location.href = `myapp://path/into/app?authResult=${encodeURIComponent(JSON.stringify(results))}`))
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
 
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
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
    dangerouslySetInnerHTML: PropTypes.shape({
      __html: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

App.defaultProps = {
  isServerSide: false,
  config: null,
};

export default App;
