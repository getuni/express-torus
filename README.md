# express-torus
A simple drop-in middleware for [`express`](https://github.com/expressjs/express) which enables decentralized key management using [Tor.us](https://tor.us/), a service that provides decentralized key management across a huge variety of authentication providers such as [**Twitter**](https://twitter.com/home), [**Facebook**](https://www.facebook.com/), [**Twitch**](http://twitch.com/) and countless others, powered by the [**Ethereum**](https://ethereum.org/en/) blockchain.

## Getting Started

To install [`express-torus`](https://github.com/cawfree/express-torus), add the following dependencies:

```bash
yarn add @toruslabs/torus-direct-web-sdk prop-types react-dom react express-torus
```

Then just add the middleware to your express app. In the example below, we use [**Google**](https://google.com) as an authentication provider:

```javascript
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
  .listen(3000, console.log);
```

For more information on defining authentication providers, please check out [**torusresearch**](https://github.com/torusresearch)'s [`torus-direct-web-sdk`](https://github.com/torusresearch/torus-direct-web-sdk) [**example**](https://github.com/torusresearch/torus-direct-web-sdk/blob/26ad6a9d3ff10c935a202b93539c94de3978a5b4/examples/vue-app/src/App.vue#L42).

## License
[**MIT**](./LICENSE)
