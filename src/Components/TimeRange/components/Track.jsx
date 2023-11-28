import React from "react";

const getTrackConfig = ({ error, source, target }) => {
  const basicStyle = {
    left: `${source.percent}%`,
    width: `calc(${target.percent - source.percent}% - 1px)`,
  };

  return { ...basicStyle };
};

const Track = ({ error, source, target, getTrackProps }) => {
  return (
    <>
      <div
        className="react_time_range__track"
        style={getTrackConfig({ error, source, target })}
        {...getTrackProps()}
      />
    </>
  );
};

export default Track;
