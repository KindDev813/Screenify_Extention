import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "../../../utils/functions";

const getRangeRailInnerStyleOrg = ({ backgroundImages }) => {
  if (backgroundImages.length === 0) {
    return {};
  }

  const backgroundImage = backgroundImages
    .map((value) => {
      return `url("${value}")`;
    })
    .join(",");

  const backgroundPosition = backgroundImages
    .map((value, index) => {
      return `calc(100% / ${backgroundImages.length - 1} * ${index}) 0%`;
    })
    .join(",");

  const style = {
    backgroundImage: backgroundImage,
    backgroundPosition: backgroundPosition,
    backgroundSize: `calc(100% / ${backgroundImages.length}) 100%`,
    backgroundRepeat: "no-repeat",
  };

  return style;
};

const getRangeRailInnerStyleTop = ({
  backgroundImages,
  limitMinTrimValue,
  limitMaxTrimValue,
}) => {
  if (backgroundImages.length === 0) {
    return {};
  }

  const backgroundImage = backgroundImages
    .map((value) => {
      return `url("${value}")`;
    })
    .join(",");

  const backgroundPosition = backgroundImages
    .map((value, index) => {
      return `calc(100% / ${backgroundImages.length - 1} * ${index}) 0%`;
    })
    .join(",");

  const style = {
    backgroundImage: backgroundImage,
    backgroundPosition: backgroundPosition,
    backgroundSize: `calc(100% / ${backgroundImages.length}) 100%`,
    backgroundRepeat: "no-repeat",
    clipPath: `inset(0px ${
      100 - limitMaxTrimValue
    }% 0px ${limitMinTrimValue}%)`,
  };

  return style;
};

export const SliderRail = ({
  getRailProps,
  backgroundImages,
  limitMinTrimValue,
  limitMaxTrimValue,
}) => {
  return (
    <>
      <div className="react_time_range__rail__outer" {...getRailProps()} />

      <div className="react_time_range__rail__inner_container">
        {!isEmpty(backgroundImages) && (
          <>
            <div
              className="react_time_range__rail__inner_org"
              style={getRangeRailInnerStyleOrg({ backgroundImages })}
            />
            <div
              className="react_time_range__rail__inner_top"
              style={getRangeRailInnerStyleTop({
                backgroundImages,
                limitMinTrimValue,
                limitMaxTrimValue,
              })}
            />
          </>
        )}
      </div>
    </>
  );
};

export default SliderRail;
