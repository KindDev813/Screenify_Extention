import React, { useState, useEffect } from "react";
import { Spin, Button } from "antd";
import { LABEL } from "../../utils/constants";

import TimeRange from "../../Components/TimeRange";
import BgMusicOverControl from "../../Components/BgMusicOverControl";
import VideoPlayer from "../../Components/VideoPlayer";
import EditToolMenu from "../../Components/EditToolMenu";
import {
  trimVideoFFmpeg,
  cropVideoFFmpeg,
  musicOverFFmpeg,
  extractImagesFFmpeg,
  getVideoDimensions,
  alertModal,
  isEmpty,
} from "../../utils/functions";

import "./style.css";

const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
  corePath: chrome.runtime.getURL("vendor/ffmpeg-core.js"),
  log: true,
  mainName: "main",
});

function OptionsApp() {
  const [limitMinTrimValue, setlimitMinTrimValue] = useState(0);
  const [limitMaxTrimValue, setlimitMaxTrimValue] = useState(100);
  const [localVideoLink, setLocalVideoLink] = useState("");
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [currentTool, setCurrentTool] = useState(LABEL.TRIM);
  const [overMusic, setOverMusic] = useState(null);
  const [cropDimensions, setCropDimensions] = useState();
  const [origDimensions, setOrigDimensions] = useState({});
  const [maxTime, setMaxTime] = useState([]);
  const [timeRangeBgImages, setTimeRangeBgImages] = useState([]);

  useEffect(() => {
    const loadFfmpeg = async () => {
      await ffmpeg.load();
      setLoadingVisible(false);
    };

    chrome.storage.sync.get("BLOB_LINK", function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        result.BLOB_LINK
          ? setLocalVideoLink(result.BLOB_LINK)
          : setLocalVideoLink();
      }
    });

    const storageListener = (changes, areaName) => {
      if (areaName !== "sync") return;
      if (changes.BLOB_LINK) {
        setLocalVideoLink(changes.BLOB_LINK.newValue);
      }
    };

    chrome.storage.onChanged.addListener(storageListener);
    loadFfmpeg();
    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
    };
  }, []);

  useEffect(() => {
    if (localVideoLink) {
      getVideoDimensions(localVideoLink)
        .then(({ width, height }) => {
          setOrigDimensions({ width: width, height: height });
        })
        .catch((error) => {
          console.log(`Error occurred: ${error}`);
        });
    }
  }, [localVideoLink]);

  useEffect(() => {
    const getImages = async () => {
      if (localVideoLink && !loadingVisible) {
        let fileName = new Date().getTime();
        let imageLinks = await extractImagesFFmpeg(
          ffmpeg,
          localVideoLink,
          maxTime,
          fileName,
          fetchFile
        );
        setTimeRangeBgImages(imageLinks);
        setLoadingVisible(false);
      }
    };

    getImages();
  }, [localVideoLink, loadingVisible]);

  const onSaveAndDownload = async () => {
    setLoadingVisible(true);
    let fileName = new Date().getTime();
    let downUrl;

    switch (currentTool) {
      case LABEL.TRIM:
        downUrl = await trimModeDown(fileName);
        break;
      case LABEL.CROP:
        downUrl = await cropModeDown(fileName);
        break;
      case LABEL.BGMUSIC:
        downUrl = await musicOverModeDown(fileName);
        break;
    }

    const a = document.createElement("a");
    a.href = downUrl;
    a.download = `${fileName}.mp4`;
    setLoadingVisible(false);
    a.click();
  };

  const trimModeDown = async (fileName) => {
    let url = await trimVideoFFmpeg(
      ffmpeg,
      fileName,
      localVideoLink,
      (maxTime / 100) * limitMinTrimValue,
      (maxTime / 100) * limitMaxTrimValue,
      fetchFile
    );

    return url;
  };

  const cropModeDown = async (fileName) => {
    let url = await cropVideoFFmpeg(
      ffmpeg,
      fileName,
      localVideoLink,
      cropDimensions,
      origDimensions,
      fetchFile
    );

    return url;
  };

  const musicOverModeDown = async (fileName) => {
    let url = await musicOverFFmpeg(
      ffmpeg,
      fileName,
      localVideoLink,
      overMusic,
      fetchFile
    );

    return url;
  };

  return (
    <Spin spinning={loadingVisible} size="large" delay={500}>
      <div className="op_container">
        <EditToolMenu
          handleCurrentTool={(value) => setCurrentTool(value)}
          currentTool={currentTool}
        />

        <div className="op_contain_com">
          <div className="op_done_btn">
            <Button
              type="primary"
              shape="round"
              onClick={() => {
                onSaveAndDownload();
              }}
            >
              Done
            </Button>
          </div>

          <VideoPlayer
            localVideoLink={localVideoLink}
            currentTool={currentTool}
            limitMinTrimValue={(maxTime / 100) * limitMinTrimValue}
            limitMaxTrimValue={(maxTime / 100) * limitMaxTrimValue}
            handleCropDimensionsData={(value) => setCropDimensions(value)}
          />

          {currentTool === LABEL.TRIM && (
            <TimeRange
              error={false}
              ticksNumber={20}
              localVideoLink={localVideoLink}
              backgroundImages={timeRangeBgImages}
              selectedInterval={[0, 100]}
              onUpdateCallback={(value) => {
                setlimitMinTrimValue(value[0]);
                setlimitMaxTrimValue(value[1]);
              }}
              maxTime={maxTime}
              handleMaxTime={(value) => setMaxTime(value)}
              step={100 / maxTime}
              limitMinTrimValue={limitMinTrimValue}
              limitMaxTrimValue={limitMaxTrimValue}
            />
          )}
          {currentTool === LABEL.BGMUSIC && (
            <BgMusicOverControl
              overMusic={overMusic}
              handleOverMusic={(value) => setOverMusic(value)}
            />
          )}
        </div>
      </div>
    </Spin>
  );
}

export default OptionsApp;
