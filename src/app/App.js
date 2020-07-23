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

  const shouldTriggerLogin = useCallback(
    selectedVerifier => Promise
      .resolve()
      .then(
        () => {
          if (!didInit) {
            return Promise.reject(new Error("The sdk has not been initialized."));
          }
          return undefined;
        }
      )
      .then(
        () => {
          const jwtParams = loginToConnectionMap[selectedVerifier] || {};
          const { typeOfLogin, clientId, verifier } = verifierMap[selectedVerifier];
          return sdk.triggerLogin({typeOfLogin, verifier, clientId, jwtParams});
        },
      ),
    [sdk, didInit, loginToConnectionMap],
  );
  return (
    <div>
      <button
        onClick={() => shouldTriggerLogin("twitter")}
      >
        "hello from react file"
      </button>
    </div>
  );
};

App.propTypes = {
  config: PropTypes.shape({
    baseUrl: PropTypes.string.isRequired,
    proxyContractAddress: PropTypes.string.isRequired,
    network: PropTypes.string.isRequired,
    enableLogging: PropTypes.bool,
    loginToConnectionMap: PropTypes.shape({}).isRequired,
    verifierMap: PropTypes.shape({}).isRequired,
  }).isRequired,
};

App.defaultProps = {
  config: null,
};

export default App;
