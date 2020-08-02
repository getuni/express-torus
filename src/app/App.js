import React, {useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import TorusSdk from "@toruslabs/torus-direct-web-sdk";
import {typeCheck} from "type-check";
import jsrsasign from "jsrsasign";
import {FacebookLoginButton, GoogleLoginButton, GithubLoginButton, LinkedInLoginButton, TwitterLoginButton, createButton} from "react-social-login-buttons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagic, faKey, faMobile} from "@fortawesome/free-solid-svg-icons";
import {faGoogle,faFacebook,faReddit,faDiscord,faTwitch, faGithub, faApple, faLinkedin, faTwitter, faWeibo, faLine, } from "@fortawesome/free-brands-svg-icons";

import {Loading} from "./components";

const styles = Object.freeze({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  loadingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
});

const RedditLoginButton = createButton(
  {
    text: "Login with Reddit",
    icon: () => <FontAwesomeIcon icon={faReddit} />,
    style: { background: "#F84300" },
    activeStyle: { background: "#F84300" }
  },
);

const DiscordLoginButton = createButton(
  {
    text: "Login with Discord",
    icon: () => <FontAwesomeIcon icon={faDiscord} />,
    style: { background: "#6F83D2" },
    activeStyle: { background: "#6F83D2" }
  },
);

const TwitchLoginButton = createButton(
  {
    text: "Login with Twitch",
    icon: () => <FontAwesomeIcon icon={faTwitch} />,
    style: { background: "#5D3DA5" },
    activeStyle: { background: "#5D3DA5" },
  },
);

const AppleLoginButton = createButton(
  {
    text: "Login with Apple",
    icon: () => <FontAwesomeIcon icon={faApple} />,
    style: { background: "#000000" },
    activeStyle: { background: "#000000" }
  },
);

const WeiboLoginButton = createButton(
  {
    text: "Login with Weibo",
    icon: () => <FontAwesomeIcon icon={faWeibo} />,
    style: { background: "#E0152C" },
    activeStyle: { background: "#F89532" }
  },
);

const LineLoginButton = createButton(
  {
    text: "Login with Line",
    icon: () => <FontAwesomeIcon icon={faLine} />,
    style: { background: "#00C000" },
    activeStyle: { background: "#00C000" }
  },
);

const EmailPasswordLoginButton = createButton(
  {
    text: "Login with Email and Password",
    icon: () => <FontAwesomeIcon icon={faKey} />,
    style: { background: "#3b5998" },
    activeStyle: { background: "#293e69" }
  },
);

const PasswordlessLoginButton = createButton(
  {
    text: "Passwordless Login",
    icon: () => <FontAwesomeIcon icon={faMagic} />,
    style: { background: "#3b5998" },
    activeStyle: { background: "#293e69" }
  },
);

const SMSPasswordlessLoginButton = createButton(
  {
    text: "Login with SMS",
    icon: () => <FontAwesomeIcon icon={faMobile} />,
    style: { background: "#3b5998" },
    activeStyle: { background: "#293e69" }
  },
);

const providers = {
  google: ({...extras}) => <GoogleLoginButton {...extras}/>,
  facebook: ({...extras}) => <FacebookLoginButton {...extras}/>,
  reddit: ({...extras}) => <RedditLoginButton {...extras}/>,
  discord: ({...extras}) => <DiscordLoginButton {...extras}/>,
  twitch: ({...extras}) => <TwitchLoginButton {...extras}/>,
  github: ({...extras}) => <GithubLoginButton {...extras}/>,
  apple: ({...extras}) => <AppleLoginButton {...extras}/>,
  linkedin: ({...extras}) => <LinkedInLoginButton {...extras}/>,
  twitter: ({...extras}) => <TwitterLoginButton {...extras}/>,
  weibo: ({...extras}) => <WeiboLoginButton {...extras}/>,
  line: ({...extras}) => <LineLoginButton {...extras}/>,
  email_password: ({...extras}) => <EmailPasswordLoginButton {...extras}/>,
  passwordless: ({...extras}) => <PasswordlessLoginButton {...extras}/>,
  // TODO: What configuration to use here? Sounds custom?
  //["hosted_email_passwordless",],
  hosted_sms_passwordless: ({...extras}) => <SMSPasswordlessLoginButton {...extras}/>,
};

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
    loginToConnectionMap,
    verifierMap,
    network,
    deepLinkUri,
    cert,
  } = config;

  const [success, setSuccess] = useState(false);
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
    (selectedVerifier) => {
      const verify = verifierMap[selectedVerifier];
      const jwtParams = loginToConnectionMap[selectedVerifier];
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
                // TODO: use a more robust method for url query parameters
                const q = deepLinkUri.includes("?") ? "&" : "?";
                return Promise.resolve()
                  .then(() => setSuccess(true))
                  .then(() => window.location.href = `${deepLinkUri}${q}torus=${encodeURIComponent(JSON.stringify(encryptedData))}`);
              }
              return undefined;
            },
          )
          .catch(setError)
          .then(() => setLoading(false)) && undefined;
      }
      return Promise.reject(new Error(`Not yet initialized!`)) && undefined;
    },
    [didInit, sdk, verifierMap, loginToConnectionMap, setError, setSuccess],
  );

  return (
    <div style={styles.container}>
      {(!!loading || !!success) ? (
        <div style={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <>
          {Object.keys(verifierMap).map(
            (k, i) => {
              const {[k]: Component} = providers;
              return (!!Component) && (
                <Component
                  key={i}
                  onClick={() => shouldTriggerLogin(k)}
                />
              );
            },
          ).filter(e => !!e)}
        </>
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
    loginToConnectionMap: PropTypes.shape({}).isRequired,
    verifierMap: PropTypes.shape({}).isRequired,
    deepLinkUri: PropTypes.string,
    cert: PropTypes.string.isRequired,
  }).isRequired,
};

App.defaultProps = {
  isServerSide: false,
  config: null,
};

export default App;
