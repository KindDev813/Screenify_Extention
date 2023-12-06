import React, { useEffect } from "react";
import { scaleTime } from "d3-scale";
import { Spin } from "antd";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { LOCAL_STORAGE } from "../../utils/constants";

import SliderRail from "./components/SliderRail";
import Track from "./components/Track";
import Tick from "./components/Tick";
import Handle from "./components/Handle";

import "./style.css";
import { isEmpty } from "../../utils/functions";

const TimeRange = (props) => {
  const {
    localVideoLink,
    maxTime,
    handleMaxTime,
    limitMinTrimValue,
    limitMaxTrimValue,
    onUpdateCallback,
  } = props;

  useEffect(() => {
    if (localVideoLink) {
      chrome.storage.sync.get("RECORDING_DURATION", function (result) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          result.RECORDING_DURATION
            ? handleMaxTime(Math.floor(result.RECORDING_DURATION / 1000))
            : handleMaxTime();
        }
      });

      const storageListener = (changes, areaName) => {
        if (areaName !== "sync") return;
        if (changes.RECORDING_DURATION) {
          handleMaxTime(changes.RECORDING_DURATION.newValue);
        }
      };

      chrome.storage.onChanged.addListener(storageListener);

      return () => {
        chrome.storage.onChanged.removeListener(storageListener);
      };
    } else {
      handleMaxTime(0);
    }
  }, [localVideoLink]);

  // Handle onUpdate event
  const onUpdate = (newTime) => {
    onUpdateCallback(newTime);
  };

  // Get date ticks
  const getDateTicks = () => {
    const { ticksNumber } = props;
    return scaleTime()
      .domain([0, maxTime])
      .ticks(ticksNumber)
      .map((t) => +t);
  };

  return (
    <div
      className={
        props.containerClassName || "react_time_range__time_range_container"
      }
    >
      <Slider
        step={props.step}
        onUpdate={onUpdate}
        values={props.selectedInterval.map((t) => +t)}
        rootStyle={{ position: "relative", width: "100%" }}
      >
        <Ticks values={getDateTicks()}>
          {({ ticks }) => (
            <>
              {ticks.map((tick, i) => (
                <Tick
                  key={tick.id}
                  tick={tick}
                  count={ticks.length}
                  index={i}
                />
              ))}
            </>
          )}
        </Ticks>

        <Spin
          spinning={isEmpty(props.backgroundImages) ? true : false}
          size="large"
          delay={500}
        >
          <Rail>
            {({ getRailProps }) => (
              <SliderRail
                className={props.sliderRailClassName}
                getRailProps={getRailProps}
                backgroundImages={props.backgroundImages}
                limitMinTrimValue={limitMinTrimValue}
                limitMaxTrimValue={limitMaxTrimValue}
              />
            )}
          </Rail>
        </Spin>

        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <>
              {tracks?.map(({ id, source, target }) => (
                <Track
                  error={props.error}
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </>
          )}
        </Tracks>
      </Slider>
    </div>
  );
};

export default TimeRange;
