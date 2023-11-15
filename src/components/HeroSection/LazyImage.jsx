import React from "react";

const LazyImage = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="slider-image w-100"
      style={{ width: "100%", height: "auto" }}
    />
  );
};

export default LazyImage;
