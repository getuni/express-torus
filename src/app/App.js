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

  const [sdk] = useState(
    new TorusSdk({
      baseUrl,
      enableLogging,
      proxyContractAddress,
      network,
    }),
  );

  const [didInit, setDidInit] = useState(false);

  useEffect(
    () => sdk
      .init({skipSw: false})
      .then(() => setDidInit(true))
      .catch(setError) && undefined,
    [sdk, setDidInit],
  );

  useEffect(
    () => {
      if (didInit) {
        const {typeOfLogin, clientId, verifier} = verify;

        // TODO: How to propagate result?
        sdk.triggerLogin({
          typeOfLogin,
          verifier,
          clientId,
          jwtParams,
        })
          .then(console.log)
          .catch(setError);
      }
    },
    [didInit, sdk, verify, jwtParams, setError],
  );
  return (
    <div>
      <span>
        {didInit ? "Initializing..." : "Initialized."}
      </span>
      <span>
        {!!error && error.toString()}
      </span>
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
