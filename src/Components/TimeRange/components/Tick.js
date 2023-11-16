import React from "react";

const Tick = ({ tick, count, index }) => {
  const tickLabelStyle = {
    marginLeft: `${-(100 / count) / 2}%`,
    width: `${100 / count}%`,
    left: `${(100 / (count - 1)) * index}%`,
  };

  return (
    <>
      <div
        className="react_time_range__tick_marker"
        style={{ left: `${(100 / (count - 1)) * index}%` }}
      />

      <div className="react_time_range__tick_label" style={tickLabelStyle}>
        {(index === 0 || index === count - 1) && tick.value + "s"}
      </div>
    </>
  );
};

export default Tick;
