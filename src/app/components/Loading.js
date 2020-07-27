import React from "react";
import PropTypes from "prop-types";
import Lottie from "react-lottie";

import animationData from "../assets/loading";

const options = {
  loop: true,
  autoplay: true, 
  animationData,
  rendererSettings: {},
};

const Loading = ({size, ...extraProps}) => {
  return (
    <Lottie
      width={size}
      height={size}
      options={options}
      isStopped={false}
      isPaused={false}
    />
  );
};

Loading.propTypes = {
  size: PropTypes.any,
};

Loading.defaultProps = {
  size: "80%",
};

export default Loading;
