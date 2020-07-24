import React from "react";
import PropTypes from "prop-types";

const Gradient = ({width, height, startColor, stopColor, ...extraProps}) => {
  return (
    <svg
      style={{ width, height }}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <defs>
        <linearGradient
          spreadMethod="pad"
          id="gradient"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor={startColor}
            stopOpacity="1"
          />
          <stop
            offset="100%"
            stopColor={stopColor}
            stopOpacity="1"
          />
        </linearGradient>
      </defs>
      <rect
        width={width}
        height={height}
        y="0"
        x="0"
        fill="url(#gradient)"
      />
    </svg>
  );
};

Gradient.propTypes = {
  startColor: PropTypes.string,
  stopColor: PropTypes.string,
};

Gradient.defaultProps = {
  startColor: "#854AA7",
  stopColor: "#A86ADD",
  width: "100%",
  height: "100%",
};

export default Gradient;
