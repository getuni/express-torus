import React, {useState, useEffect} from "react";
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
  // TODO: props
  const [sdk] = useState(
    new TorusSdk({
      baseUrl,
      enableLogging,
      proxyContractAddress,
      network,
    }),
  );
  useEffect(
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
        .catch(console.error)
    },
    [sdk],
  );
  return (
    <div>
      "hello from react file"
    </div>
  );
};

App.propTypes = {
  config: PropTypes.shape({

  }).isRequired,
};

App.defaultProps = {
  config: null,
};

export default App;
