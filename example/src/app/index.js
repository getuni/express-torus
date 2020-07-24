import React, {useState} from "react";
import PropTypes from "prop-types";
import {render} from "react-dom";
import {StyleSheet, css} from "aphrodite";
import FittedImage from "react-fitted-image";

import {Splash} from "./components";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  prompt: {
    zIndex: 10,
    fontSize: 100,
    color: "white",
  },
});

const App = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className={css(styles.container)} onClick={() => Promise
        .resolve()
        .then(() => setLoading(true))
        .then(window.__TORUS_TRIGGER_AUTH__)}>
      <FittedImage
        className={css(styles.container)}
        fit="cover"
        src="https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-1.2.1&w=1000&q=80"
      />
      <Splash
        loading={loading}
      />
    </div>
  );
};

render(
  <App />,
  document.getElementById("root"),
);
