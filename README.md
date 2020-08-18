# express-torus
A simple drop-in middleware for [`express`](https://github.com/expressjs/express) which enables decentralized key management using [Tor.us](https://tor.us/), a service that provides decentralized key management across a huge variety of authentication providers such as [**Twitter**](https://twitter.com/home), [**Facebook**](https://www.facebook.com/), [**Twitch**](http://twitch.com/) and countless others, powered by the [**Ethereum**](https://ethereum.org/en/) blockchain.

To see how this works on the client, check out [`express-torus-react-native`](https://github.com/cawfree/express-torus-react-native).

This project was created as part of the [**Gitcoin**](https://gitcoin.co/) [**KERNEL Genesis Block**](https://gitcoin.co/blog/announcing-kernel/).

## 🚀 Getting Started

To install [`express-torus`](https://github.com/cawfree/express-torus), add the following dependencies:

```bash
yarn add @toruslabs/torus-direct-web-sdk prop-types react-dom react express-torus type-check
``` Then just add the middleware to your express app. In the example below, we use [**Google**](https://google.com) as an authentication provider: ```javascript
import express from "express";
import {torus} from "express-torus";

const GOOGLE = "google";

const verifierMap = {
  [GOOGLE]: {
    name: "Google",
    typeOfLogin: "google",
    clientId: "221898609709-obfn3p63741l5333093430j3qeiinaa8.apps.googleusercontent.com",
    verifier: "google-lrc",
  },
};

const loginToConnectionMap = {};

express()
  .use(torus({
    verifierMap,
    loginToConnectionMap,
    enableLogging: true,
    proxyContractAddress: "0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183",
    network: "ropsten",
  })
  .listen(3000, console.log); // Creates a torus-connected login at localhost:3000/torus/google!
```

For more information on defining authentication providers, please check out [**torusresearch**](https://github.com/torusresearch)'s [`torus-direct-web-sdk`](https://github.com/torusresearch/torus-direct-web-sdk) [**Example**](https://github.com/torusresearch/torus-direct-web-sdk/blob/26ad6a9d3ff10c935a202b93539c94de3978a5b4/examples/vue-app/src/App.vue#L42).

### Using a Custom Verifier

The [**Tor.us**](https://tor.us) example above shows how we can use a pre-configured verifier defined by the tor.us team, for us with experimenting with example applications that run on your [**localhost:3000***](http://localhost:3000); however to use on a custom domain, you perform the following additional steps:

  - Register an account with [**Auth0**](https://auth0.com/)
  - Provide Tor.us with your `${YOUR_AUTH0_DOMAIN}.auth0.com/.well-known/jwks.json` along with your **Auth0 Application Identifier** (**not** your Global Identiier), which you can find in your applications.
    - You can get in touch with the talented team of tor.us developers via their [**Telegram**](https://t.me/TorusLabs).
    - You can view the identifiers of each application at `https://manage.auth0.com/dashboard/us/${YOUR_AUTH0_DOMAIN}/applications`.
    - Tor.us will provide you with a verifier URL.
    - You are not required to use a Auth0 Custom Domain for this solution to work. (Normally, this is just done to have a _pretty_ URL.)
  - Define your Auth0 `AUTH_DOMAIN` (i.e. `https://${YOUR_AUTH0_DOMAIN}.auth0.com`) in the `loginToConnectionMap`.
  - Finally, you'll need to register your authentication callback URLs.
    - Here's an example using [**Twitter**](https://auth0.com/docs/connections/social/twitter). (Make sure you [**set up the connection**](https://auth0.com/docs/connections/social/twitter)!)

## ✌️ License
[**MIT**](./LICENSE)
