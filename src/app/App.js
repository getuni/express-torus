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
  const [results, setResults] = useState(null);

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
          .then(
            () => sdk.triggerLogin({
              typeOfLogin,
              verifier,
              clientId,
              jwtParams,
            }),
          )
          .then(setResults)
          .catch(setError) && undefined;
      }
      return Promise.reject(new Error(`Not yet initialized!`)) && undefined;
    },
    [didInit, sdk, verify, jwtParams, setError, setResults],
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
              onClick={shouldTriggerLogin}
              children="Sign In"
            />
          )}
        </>
      ) : (
        <span
          children={error.toString()}
        />
      )}
      {(!!results) && (
        <span
          children={JSON.stringify(results)}
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
