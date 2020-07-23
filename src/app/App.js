import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import TorusSdk from "@toruslabs/torus-direct-web-sdk";

const App = ({config}) => {
  const {
    baseUrl,
    enableLogging,
    proxyContractAddress,
    network,
    jwtParams,
    verify,
  } = config;

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
      .init()
      .then(() => setDidInit(true))
      .catch(console.error) && undefined,
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
        });
      }
    },
    [didInit, sdk, verify, jwtParams],
  );
  return null;
};

App.propTypes = {
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
  config: null,
};

export default App;
