import React from "react";
import PropTypes from "prop-types";
import Lottie from "react-lottie";

import lock from "../assets/lock";
import bubble from "../assets/bubble";

const baseOptions = {
  rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
};

const lockOptions = {
  ...baseOptions,
  loop: false,
  autoplay: true,
  animationData: lock,
};

const bubbleOptions = {
  ...baseOptions,
  loop: true,
  autoplay: true,
  animationData: bubble,
};

const Splash = ({width, height, loading, ...extraProps}) => {
  return (
    <Lottie
      width={width}
      height={height}
      options={loading ? bubbleOptions : lockOptions}
      isStopped={false}
      isPaused={false}
    />
  );
};

Splash.propTypes = {
  loading: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
};

Splash.defaultProps = {
  loading: false,
  width: 400,
  height: 400,
};

export default Splash;
