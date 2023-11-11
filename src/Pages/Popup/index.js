import React, { useState, useEffect } from "react";
import { Button, Radio } from "antd";
import {
  ChromeOutlined,
  DesktopOutlined,
  VideoCameraOutlined,
  WindowsOutlined,
} from "@ant-design/icons";

import LabelSelect from "../../Components/LabelSelect";
import { QUALITYOPTIONS, LABEL, LOCAL_STORAGE } from "../../utils/constants";
import "./style.css";

let mediaRecorder = null,
  stream = null,
  screenStream = null,
  microphoneStream = null,
  recordingStartTime = null,
  recordingEndTime = null;

let cameraDeviceCounter = 0,
  micDeviceCounter = 0;

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
  const [visibleWebcamDrag, setVisibleWebcamDrag] = useState(false); // Webcam Drag enable/disable
  const [cameraSource, setCameraSource] = useState("Disabled"); // Camera source deviceId
  const [microphoneSource, setMicrophoneSource] = useState("Disabled"); // Camera source deviceId
  const [visibleTimeCounterModal, setVisibleTimeCounterModal] = useState(false); // Time Counter Modal enable/disable

  const [countNumber, setCountNumber] = useState(4); // Time counter number
  const [visibleEditMenu, setVisibleEditMenu] = useState(false); // Edit tool menu enable/disable
  const [cameraAllowed, setCameraAllowed] = useState(false); // Camera permission status
  const [microphoneAllowed, setMicrophoneAllowed] = useState(false); // Microphone permission status
  const [recordedChunks, setRecordedChunks] = useState([]); // Recorded chunks
  const [microphoneOptions, setMicrophoneOptions] = useState([]); // Microphone source list
  const [cameraOptions, setCameraOptions] = useState([]); // Camera source list
  const [audioDeviceExisting, setAudioDeviceExisting] = useState(false);
  const [videoDeviceExisting, setVideoDeviceExisting] = useState(false);

  useEffect(() => {
    chrome.permissions.contains(
      {
        permissions: ["tabs", "microphone", "camera"],
      },
      function (result) {
        console.log("Chrome Audio and VIdeo permission~~~~~~~~~~", result);
      }
    );
  });

  // Get camera & audio device
  useEffect(() => {
    const getDeviceName = async () => {
      await navigator.mediaDevices.enumerateDevices().then(async (devices) => {
        devices.forEach((device) => {
          if (device.kind === "videoinput") {
            cameraDeviceCounter++;
          }
          if (device.kind === "audioinput") {
            micDeviceCounter++;
          }
        });
      });

      if (cameraDeviceCounter !== 0 && micDeviceCounter !== 0) {
        await navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            console.log(stream);
            console.log("You can use Audio and Video device");
          })
          .catch((err) => {
            console.log(err);
            console.log("You can not use Audio and Video device");
          });
        setVideoDeviceExisting(true);
        setAudioDeviceExisting(true);
      } else {
        if (cameraDeviceCounter !== 0) {
          await navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
              console.log("You can use Video device");
            })
            .catch((err) => {
              console.log("You can not use Video device");
            });
          setVideoDeviceExisting(true);
        }

        if (micDeviceCounter !== 0) {
          await navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              console.log("You can use Audio device");
            })
            .catch((err) => {
              console.log("You can not use Audio device");
            });
          setAudioDeviceExisting(true);
        }
      }
    };

    getDeviceName();
  }, []);

  useEffect(() => {
    if (videoDeviceExisting) {
      navigator.permissions.query({ name: "camera" }).then((res) => {
        console.log("camera is existing~~~~~~~~~~~~~", res);
        if (res.state == "granted") {
          setCameraAllowed(true);
          onGetDeviceSource();
        } else {
          setCameraAllowed(false);
        }
      });
    }

    if (audioDeviceExisting) {
      navigator.permissions.query({ name: "microphone" }).then((res) => {
        if (res.state == "granted") {
          setMicrophoneAllowed(true);
          onGetDeviceSource();
        } else {
          setMicrophoneAllowed(false);
        }
      });
    }
  }, [audioDeviceExisting, videoDeviceExisting]);

  // Time counter
  useEffect(() => {
    let temp = 4;
    function updateCountdown() {
      switch (temp) {
        case 0:
          onCloseModalStartRecording();
          setVisibleEditMenu(true);
          break;
        case 1:
          setRecordingStarted(true);
          setVisibleTimeCounterModal(false);
        default:
          temp--;
          setCountNumber(temp);
          setTimeout(updateCountdown, 1000);
      }
    }

    if (visibleTimeCounterModal) {
      updateCountdown();
    }
  }, [visibleTimeCounterModal]);

  useEffect(() => {
    if (cameraAllowed) {
      if (cameraSource === "Disabled") {
        setVisibleWebcamDrag(false);
      } else {
        setVisibleWebcamDrag(true);
      }
    } else {
      setVisibleWebcamDrag(false);
    }
  }, [cameraSource, microphoneSource, cameraAllowed]);

  // Putting chunks during the recording
  useEffect(() => {
    if (mediaRecorder && recordingStarted) {
      mediaRecorder.ondataavailable = (e) => {
        let temp = recordedChunks;
        temp.push(e.data);
        setRecordedChunks(temp);
      };

      mediaRecorder.start();
    }
  }, [mediaRecorder]);

  useEffect(() => {
    const onEnded = () => {
      onSaveRecording();
    };

    if (stream) {
      stream.getVideoTracks()[0].addEventListener("ended", onEnded);
    }

    return () => {
      if (stream) {
        stream.getVideoTracks()[0].removeEventListener("ended", onEnded);
      }
    };
  }, [stream]);

  // Start recording &  Getting the stream and merging the each stream according to recording mode
  const onStartRecording = async () => {
    try {
      if (recordingMode === 3) {
        if (cameraSource === "Disabled") {
          alertModal("Please enable your camera(microphone)!");
        } else {
          let onlyCameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: cameraSource ? cameraSource : undefined,
            },
            audio: microphoneSource
              ? {
                  deviceId: microphoneSource,
                }
              : false,
          });

          stream = onlyCameraStream;
          setVisibleTimeCounterModal(true);
        }
      } else {
        const audioContext = new AudioContext();
        let audioIn_01, audioIn_02;
        let dest = audioContext.createMediaStreamDestination();

        screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface:
              recordingMode === 0
                ? "monitor"
                : recordingMode === 1
                ? "window"
                : "browser",
          },
          audio: true,
        });

        if (screenStream.getAudioTracks()[0]) {
          let screenAudioMediaStream = new MediaStream();
          screenAudioMediaStream.addTrack(screenStream.getAudioTracks()[0]);

          audioIn_01 = audioContext.createMediaStreamSource(
            screenAudioMediaStream
          );
          audioIn_01.connect(dest);
        }

        if (microphoneSource !== "Disabled") {
          microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: microphoneSource },
          });

          if (microphoneStream.getAudioTracks()[0]) {
            let micAudioMediaStream = new MediaStream();
            micAudioMediaStream.addTrack(microphoneStream?.getAudioTracks()[0]);

            audioIn_02 =
              audioContext.createMediaStreamSource(micAudioMediaStream);
            audioIn_02.connect(dest);
          }
        }

        let mergedMediaStream = new MediaStream();
        mergedMediaStream.addTrack(screenStream.getVideoTracks()[0]);
        if (
          screenStream.getAudioTracks()[0] ||
          microphoneSource !== "Disabled"
        ) {
          mergedMediaStream.addTrack(dest.stream.getAudioTracks()[0]);
        }

        stream = mergedMediaStream;
        if (recordingMode == !2) {
          setVisibleTimeCounterModal(true);
        } else {
          onCloseModalStartRecording();
          setVisibleEditMenu(true);
          setRecordingStarted(true);
        }
      }
    } catch (error) {
      console.log("Error accessing the screen: ", error);
    }
  };

  // Saving & downloading chunks into file
  const onSaveRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        recordingEndTime = new Date().getTime();
        localStorage.setItem(LOCAL_STORAGE.BLOB_LINKS, JSON.stringify(url));
        localStorage.setItem(
          LOCAL_STORAGE.RECORDING_DURATION,
          (recordingEndTime - recordingStartTime).toString()
        );
        navigate("/editMedia");

        stream.getTracks().forEach((element) => {
          element.stop();
        });

        screenStream?.getTracks().forEach((track) => {
          track.stop();
        });

        microphoneStream?.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }

    setRecordingStarted(false);
    setVisibleEditMenu(false); // Closing edit tools menu
  };

  // Pausing and Resuming
  const onPauseResume = () => {
    if (mediaRecorder.state === "recording") {
      mediaRecorder.pause();
    } else if (mediaRecorder.state === "paused") {
      mediaRecorder.resume();
    }
  };

  const onClickRecordingStartOrStop = () => {
    !recordingStarted ? onStartRecording() : onSaveRecording();
  };

  const onGetDeviceSource = async () => {
    let audioDevices = [],
      videoDevices = [];
    await navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      devices.forEach((device) => {
        if (device.kind === "videoinput") {
          cameraDeviceCounter++;
          videoDevices.push(device);
        }

        if (device.kind === "audioinput") {
          micDeviceCounter++;
          audioDevices.push(device);
        }
      });
    });

    if (!isEmpty(videoDevices)) {
      let temp = videoDevices.map((videoDevice) => {
        return { label: videoDevice.label, value: videoDevice.deviceId };
      });

      temp.unshift({ label: "Disabled", value: "Disabled" });
      setCameraOptions(temp);
    } else {
      setCameraOptions([{ label: "Disabled", value: "Disabled" }]);
    }

    if (!isEmpty(audioDevices)) {
      let temp = audioDevices.map((audioDevice) => {
        return { label: audioDevice.label, value: audioDevice.deviceId };
      });
      temp.unshift({ label: "Disabled", value: "Disabled" });
      setMicrophoneOptions(temp);
    } else {
      setMicrophoneOptions([{ label: "Disabled", value: "Disabled" }]);
    }
  };

  const onChangeCameraSource = (value) => {
    value === "Disabled" ? setCameraSource("Disabled") : setCameraSource(value);
  };

  const onChangeMicrophoneSource = (value) => {
    value === "Disabled"
      ? setMicrophoneSource("Disabled")
      : setMicrophoneSource(value);
  };

  return (
    <div className="w-[425px] border-[#a1a0a0] border-2 rounded-lg p-7 mx-auto">
      <Radio.Group
        value={recordingMode}
        onChange={(e) => setRecordingMode(e.target.value)}
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
        onChange={(e) => setQualityDefaultValue(e.target.value)}
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
