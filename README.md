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

### ⚙️ Using a Custom Verifier

The [**Tor.us**](https://tor.us) example above shows how we can use a pre-configured verifier defined by the tor.us team, for us with experimenting with example applications that run on your [**localhost:3000**](http://localhost:3000); however, to use your own login providers and domain, you perform the following additional steps:

  - Register an account with [**Auth0**](https://auth0.com/) and [**Create an Application**](https://auth0.com/docs/get-started) you wish for users to authenticate under.
  - Next, provide Tor.us with your `${YOUR_AUTH0_DOMAIN}.auth0.com/.well-known/jwks.json`, alongside with your **Auth0 Application Identifier** (and _not_ your Global Identifier).
    - You can get in touch with the talented team of tor.us developers via their [**Telegram**](https://t.me/TorusLabs).
      - Your domain might reset under a specific region, i.e. `https://${YOUR_AUTH_DOMAIN}.us.auth0.com`.
    - Tor.us will provide you with an application-specific verifier URL, which you must pass to your `verifierMap`. In addition, you need to provide the `clientId` which is the **Application Identifer** that you have provided to tor.us.
      - i.e. `const verifierMap = { twitter: { domain: "${YOUR_AUTH0_DOMAIN}"} }`.
      - Remember, be careful to check whether you should be defining a specific region for your domain!
  - Next, in your `loginToConnectionMap` you'll need to assign verifiers to your custom `domain` on Auth0.
    
  - Under your Tor.us **Application Settings**, you must register the URL of your `express` app as one of the allowed callback URLs.
   - This is usually something like `https://${YOUR_PAGE_LOCATION}/serviceworker/redirect`, or wherever you have defined your custom `/serviceworker`.
  - Finally, you'll need to register your authentication callback URLs.
    - This takes the form `https://${YOUR_AUTH0_DOMAIN}.auth0.com/login/callback`.
      - If you're using a region-specific callback, i.e. `us`, this would be `https://${YOUR_AUTH0_DOMAIN}.us.auth0.com/login/callback`.
    - Next, you'll need to [connect your Auth0 application](https://auth0.com/docs/connections) to the login provider.
    - You can verify your connection between Auth0 and the Authentication Provider by performing a connection test. This must complete successfully before you can attempt to authenticate using Tor.us on your custom frontend.

> **Note:** You are **not** required to use an _Auth0 Custom Domain_ to use Tor.us login on your own deployed server. 
> Normally, this is just done if you'd like a _pretty_ URL!

### ✍️ Custom Authentication Example

Below shows a complete custom authentication solution. This outlines important conventions regarding **custom frontend configuration**, which enables you to design a totally bespoke interface around tor.us login, and **custom verifier definition** which enables your user to authenticate using a non-localhost instance.

```javascript
import express from "express";

import {torus} from "express-torus";
import appRootPath from "app-root-path";
import {OK} from "http-status-codes";
import fs from "fs";

/* define a twitter login */
const TWITTER = "twitter";
const AUTH_DOMAIN = "https://${YOUR_AUTH0_DOMAIN}.auth0.com";

/* define which route the tor.us' serviceworker is located */
const serviceWorkerPath = "/serviceworker";

/* define your verifierMap */
const verifierMap = {
  [TWITTER]: {
    name: "Twitter",
    typeOfLogin: "twitter",
    clientId: "XXXXXX", // This is your auth0 application identifier.
    verifier: "XXXXXX", // This verifier name is provided to your by tor.us.
  },
};

/* define your loginToConnectionMap */
const loginToConnectionMap = {
  [TWITTER]: { domain: AUTH_DOMAIN },
};

express()
  // XXX: Define a custom UI for your login page. (See example for a demonstration!)
  .get(`/torus/root/app.js`, (_, res) => res.status(OK).sendFile(appRootPath + '/public/torus-app.js'))
  .get(`/torus/root/vendor.js`, (_, res) => res.status(OK).sendFile(appRootPath + '/public/torus-vendor.js'))
  // XXX: Override service worker to support our domain. (You'll need to clone equivalent files in the project and manually correct the redirect URLs).
  .use(`${serviceWorkerPath}/redirect`, (_, res) => res.status(OK).sendFile(appRootPath + '/public/redirect.html'))
  .use(`${serviceWorkerPath}/sw.js`, (_, res) => res.status(OK).sendFile(appRootPath + '/public/sw.js'))
  .use(torus(
    {
      serviceWorkerPath,
      scheme: "https", // Define whether your express server sits behind https protocol.
      enableLogging: true,
      proxyContractAddress: "0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183", // Details for the test net. (This is the location of tor.us' contract).
      network: "ropsten", // The network to use.
      verifierMap,
      loginToConnectionMap,
    },
  ))
  .listen(process.env.PORT || 8080, () => null);
  ```
    
## ✌️ License
[**MIT**](./LICENSE)
