import React, { useEffect, useState } from "react";
import {render} from "react-dom";
import PostMessageStream from "post-message-stream";

const App = ({postMessageStream}) => {
  const [loading, setLoading] = useState(false);
  useEffect(
    () => {
      postMessageStream.on(
        "data",
        ({ type, ...extras }) => {
          if (type === "loading-state") {
            const { loading } = extras;
            setLoading(loading);
          }
        },
      );
    },
    [postMessageStream, setLoading],
  );
  return (
    <>
      <div style={{ height: 100 }} />
      <button
        onClick={() => postMessageStream.write({ type:"login", provider: "google" })}
        children="Login with Google"
      />
      <button
        onClick={() => postMessageStream.write({ type:"login", provider: "twitter" })}
        children="Login with Twitter"
      />
      {(!!loading) && (
        <span children="Loading..." />
      )}
    </>
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
