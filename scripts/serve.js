import express from "express";

import {torus} from "../src";

express()
  .use(torus())
  .listen(3000, () => null);
