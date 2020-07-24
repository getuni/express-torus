import React from "react";
import PropTypes from "prop-types";

import Lottie from "react-lottie";
import animationData from "../assets/lottie";

const options = {
  loop: false,
  autoplay: true,
  animationData,
  rendererSettings: {preserveAspectRatio: "xMidYMid slice"},
};

const Splash = ({width, height, ...extraProps}) => {
  return (
    <Lottie
      width={width}
      height={height}
      options={options}
      isStopped={false}
      isPaused={false}
    />
  );
};

Splash.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

Splash.defaultProps = {
  width: 400,
  height: 400,
};

export default Splash;
