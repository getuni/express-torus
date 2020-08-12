import React from "react";
import {render} from "react-dom";
import PostMessageStream from "post-message-stream";

const App = ({postMessageStream}) => {
  return (
    <button
      onClick={() => postMessageStream.write({ type:"login", provider: "twitter" })}
      children="Login with Twitter"
    />
  );
};

const postMessageStream = new PostMessageStream({
  name: "express-torus@consumer",
  target: "express-torus@provider",
});

render(
  <App postMessageStream={postMessageStream}/>,
  document.getElementById("root"),
);
