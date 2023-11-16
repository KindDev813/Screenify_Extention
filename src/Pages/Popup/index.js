import React, { useState, useEffect } from "react";
import { Button, Radio } from "antd";
import {
  ChromeOutlined,
  DesktopOutlined,
  VideoCameraOutlined,
  WindowsOutlined,
} from "@ant-design/icons";

import LabelSelect from "../../Components/LabelSelect";
import { QUALITYOPTIONS, LABEL, EVENT } from "../../utils/constants";
import { sendDatatoForeGround } from "../../utils/functions";
import "./style.css";

let mediaRecorder = null;

const modeLabels = [
  {
    label: LABEL.FULL_SCREEN,
    icon: <DesktopOutlined style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.WINDOW,
    icon: <WindowsOutlined style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.CURRENT_TAB,
    icon: <ChromeOutlined style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.CAMERA_ONLY,
    icon: (
      <VideoCameraOutlined style={{ fontSize: "30px" }} className="mx-auto" />
    ),
  },
];

function Popup() {
  const [recordingMode, setRecordingMode] = useState(0); // Recording status: 0(Full Screen), 1(Window), 2(Current Tab), 3(Camera only)
  const [qualityDefaultValue, setQualityDefaultValue] = useState("3000000"); // Recording quality status

  const [recordingStarted, setRecordingStarted] = useState(false); // Recording start
  const [cameraSource, setCameraSource] = useState("Disabled"); // Camera source deviceId

  const [cameraAllowed, setCameraAllowed] = useState(false); // Camera permission status
  const [microphoneAllowed, setMicrophoneAllowed] = useState(false); // Microphone permission status
  const [microphoneOptions, setMicrophoneOptions] = useState([]); // Microphone source list
  const [cameraOptions, setCameraOptions] = useState([]); // Camera source list

  const [pressStartButton, setPressStartButton] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get("CAMERA_ALLOWED", function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setCameraAllowed(result.CAMERA_ALLOWED);
      }
    });

    chrome.storage.sync.get("MIC_ALLOWED", function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setMicrophoneAllowed(result.MIC_ALLOWED);
      }
    });

    chrome.storage.sync.get("CAMERA_OPTIONS", function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setCameraOptions(result.CAMERA_OPTIONS);
      }
    });

    chrome.storage.sync.get("MIC_OPTIONS", function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setMicrophoneOptions(result.MIC_OPTIONS);
      }
    });

    chrome.storage.sync.get("RECORDING_STARTED", function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setRecordingStarted(result.RECORDING_STARTED);
      }
    });

    const storageListener = (changes, areaName) => {
      if (areaName !== "sync") return;
      if (changes.CAMERA_ALLOWED) {
        setCameraAllowed(changes.CAMERA_ALLOWED.newValue);
      }

      if (changes.MIC_ALLOWED) {
        setMicrophoneAllowed(changes.MIC_ALLOWED.newValue);
      }

      if (changes.CAMERA_OPTIONS) {
        setCameraOptions(changes.CAMERA_OPTIONS.newValue);
      }

      if (changes.MIC_OPTIONS) {
        setMicrophoneOptions(changes.MIC_OPTIONS.newValue);
      }

      if (changes.RECORDING_STARTED) {
        setRecordingStarted(changes.RECORDING_STARTED.newValue);
      }
    };

    chrome.storage.onChanged.addListener(storageListener);
    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
    };
  }, []);

  useEffect(() => {
    if (cameraAllowed) {
      if (cameraSource === "Disabled") {
        sendDatatoForeGround({ type: EVENT.VISIBLE_WEBCAM_DRAG, data: false });
      } else {
        sendDatatoForeGround({ type: EVENT.VISIBLE_WEBCAM_DRAG, data: true });
      }
    } else {
      sendDatatoForeGround({ type: EVENT.VISIBLE_WEBCAM_DRAG, data: false });
    }
  }, [cameraSource, cameraAllowed]);

  // Pausing and Resuming-Now is not available
  const onPauseResume = () => {
    if (mediaRecorder.state === "recording") {
      mediaRecorder.pause();
    } else if (mediaRecorder.state === "paused") {
      mediaRecorder.resume();
    }
  };

  const onClickRecordingStartOrStop = () => {
    sendDatatoForeGround({ type: EVENT.PRESS_START_BUTTON, data: true });
  };

  const onRecordingMode = (value) => {
    setRecordingMode(value);
    sendDatatoForeGround({ type: EVENT.RECORDING_MODE, data: value });
  };

  const onChangeCameraSource = (value) => {
    if (value === "Disabled") {
      setCameraSource("Disabled");
      sendDatatoForeGround({ type: EVENT.CAMERA_SOURCE, data: "Disabled" });
    } else {
      setCameraSource(value);
      sendDatatoForeGround({ type: EVENT.CAMERA_SOURCE, data: value });
    }
  };

  const onChangeMicrophoneSource = (value) => {
    if (value === "Disabled") {
      sendDatatoForeGround({ type: EVENT.MIC_SOURCE, data: "Disabled" });
    } else {
      sendDatatoForeGround({ type: EVENT.MIC_SOURCE, data: value });
    }
  };

  const onQualityDefaultValue = (value) => {
    setQualityDefaultValue(value);
    sendDatatoForeGround({ type: EVENT.QUALITY_VALUE, data: value });
  };

  return (
    <div className="w-[425px] border-[#a1a0a0] border-2 rounded-lg p-7 mx-auto">
      <Radio.Group
        value={recordingMode}
        onChange={(e) => onRecordingMode(e.target.value)}
      >
        {modeLabels.map((modeLabel, index) => {
          return (
            <Radio.Button
              className="h-[80px] w-[91px]"
              value={index}
              key={index}
            >
              <div className="flex flex-col justify-center h-full w-full w-[60px]">
                {modeLabel.icon}
                <span className="text-[12px] whitespace-nowrap flex w-full">
                  {modeLabel.label}
                </span>
              </div>
            </Radio.Button>
          );
        })}
      </Radio.Group>

      <LabelSelect
        label={LABEL.CAMERA}
        options={cameraOptions}
        allowed={cameraAllowed}
        onChangeDeviceSource={(value) => onChangeCameraSource(value)}
      />

      {/* Microphone source selection */}
      <LabelSelect
        label={LABEL.MICROPHONE}
        options={microphoneOptions}
        allowed={microphoneAllowed}
        onChangeDeviceSource={(value) => onChangeMicrophoneSource(value)}
      />

      {/* Recording quality */}
      <p className="mt-5 text-start font-bold">{LABEL.RECORDING_QUALITY}</p>
      <Radio.Group
        qualityOptions={50}
        options={QUALITYOPTIONS}
        onChange={(e) => onQualityDefaultValue(e.target.value)}
        value={qualityDefaultValue}
        className="mt-2 flex justify-between mx-10"
      />

      {/* start or stop button */}
      <div className="flex">
        <Button
          className="h-[40px] mt-5 w-full"
          type="primary"
          onClick={() => onClickRecordingStartOrStop()}
        >
          <span className="text-[15px] whitespace-nowrap font-bold">
            {!recordingStarted ? "Start Recording" : "Stop & Save"}
          </span>
        </Button>
      </div>
    </div>
  );
}

export default Popup;
