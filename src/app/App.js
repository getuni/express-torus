import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import TorusSdk from "@toruslabs/torus-direct-web-sdk";

const App = ({config}) => {
  const {
    baseUrl,
    enableLogging,
    proxyContractAddress,
    network,
    loginToConnectionMap,
    verifierMap,
    selectedVerifier,
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
    () => sdk.init()
      .then(() => setDidInit(true))
      .catch(console.error) && undefined,
    [sdk, setDidInit],
  );

  useEffect(
    () => {
      if (didInit) {
        const jwtParams = loginToConnectionMap[selectedVerifier] || {};
        const {typeOfLogin, clientId, verifier} = verifierMap[selectedVerifier];
        sdk.triggerLogin({
          typeOfLogin,
          verifier,
          clientId,
          jwtParams,
        });
      }
    },
    [selectedVerifier, didInit, sdk, loginToConnectionMap],
  );
  return null;
};

App.propTypes = {
  config: PropTypes.shape({
    baseUrl: PropTypes.string.isRequired,
    proxyContractAddress: PropTypes.string.isRequired,
    network: PropTypes.string.isRequired,
    enableLogging: PropTypes.bool,
    loginToConnectionMap: PropTypes.shape({}).isRequired,
    verifierMap: PropTypes.shape({}).isRequired,
    selectedVerifier: PropTypes.string.isRequired,
  }).isRequired,
};

App.defaultProps = {
  config: null,
};

export default App;
