import React, { useState, useEffect } from "react";
import WebcamDrag from "../../Components/WebcamDrag";
import TimeCounterModal from "../../Components/TimeCounterModal";
import AnnotationTool from "../../Components/AnnotationTool";

import { alertModal, isEmpty } from "../../utils/functions";
import { EVENT, LOCAL_STORAGE } from "../../utils/constants";

import "./style.css";

let mediaRecorder = null,
  stream = null,
  screenStream = null,
  microphoneStream = null,
  recordingStartTime = null,
  recordingEndTime = null;

let cameraDeviceCounter = 0,
  micDeviceCounter = 0;

function Foreground() {
  const [recordingMode, setRecordingMode] = useState(0); // Recording status: 0(Full Screen), 1(Window), 2(Current Tab), 3(Camera only)
  const [qualityDefaultValue, setQualityDefaultValue] = useState("3000000"); // Recording quality status

  const [recordingStarted, setRecordingStarted] = useState(false); // Recording start
  const [cameraSource, setCameraSource] = useState("Disabled"); // Camera source deviceId
  const [microphoneSource, setMicrophoneSource] = useState("Disabled"); // Camera source deviceId
  const [visibleTimeCounterModal, setVisibleTimeCounterModal] = useState(false); // Time Counter Modal enable/disable

  const [countNumber, setCountNumber] = useState(4); // Time counter number
  const [visibleEditMenu, setVisibleEditMenu] = useState(false); // Edit tool menu enable/disable
  const [recordedChunks, setRecordedChunks] = useState([]); // Recorded chunks

  const [audioDeviceExisting, setAudioDeviceExisting] = useState(false);
  const [videoDeviceExisting, setVideoDeviceExisting] = useState(false);
  const [visibleWebcamDrag, setVisibleWebcamDrag] = useState(false); // Webcam Drag enable/disable
  const [pressStartButton, setPressStartButton] = useState(false);
  const [foregroundVisible, setForegroundVisible] = useState(false);

  useEffect(() => {
    const messageListener = (request, sender, sendResponse) => {
      if (isEmpty(request)) return;
      switch (request.type) {
        case EVENT.PRESS_START_BUTTON:
          setPressStartButton(request.data);
          break;
        case EVENT.VISIBLE_WEBCAM_DRAG:
          setVisibleWebcamDrag(request.data);
          break;
        case EVENT.RECORDING_MODE:
          setRecordingMode(request.data);
          break;
        case EVENT.CAMERA_SOURCE:
          setCameraSource(request.data);
          break;
        case EVENT.QUALITY_VALUE:
          setQualityDefaultValue(request.data);
          break;
        case EVENT.MIC_SOURCE:
          setMicrophoneSource(request.data);
          break;
        case EVENT.FOREGROUND_VISIBLE:
          setForegroundVisible(request.data);
          break;
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

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
            console.log("You can use Audio and Video device");
          })
          .catch((err) => {
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

    if (foregroundVisible) {
      getDeviceName();
    }
  }, [foregroundVisible]);

  useEffect(() => {
    if (videoDeviceExisting) {
      navigator.permissions.query({ name: "camera" }).then((res) => {
        if (res.state == "granted") {
          chrome.storage.sync.set({ ["CAMERA_ALLOWED"]: true });
          onGetDeviceSource();
        } else {
          chrome.storage.sync.set({ ["CAMERA_ALLOWED"]: false });
        }
      });
    }

    if (audioDeviceExisting) {
      navigator.permissions.query({ name: "microphone" }).then((res) => {
        if (res.state == "granted") {
          chrome.storage.sync.set({ ["MIC_ALLOWED"]: true });
          onGetDeviceSource();
        } else {
          chrome.storage.sync.set({ ["MIC_ALLOWED"]: false });
        }
      });
    }
  }, [audioDeviceExisting, videoDeviceExisting]);

  useEffect(() => {
    if (pressStartButton) {
      !recordingStarted ? onStartRecording() : onSaveRecording();
      setPressStartButton(false);
    }
  }, [pressStartButton]);

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
          chrome.storage.sync.set({ ["RECORDING_STARTED"]: true });
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
      chrome.storage.sync.set({ ["CAMERA_OPTIONS"]: temp });
    } else {
      chrome.runtime.sendMessage({
        [EVENT.CAMERA_OPTIONS]: [{ label: "Disabled", value: "Disabled" }],
      });
    }

    if (!isEmpty(audioDevices)) {
      let temp = audioDevices.map((audioDevice) => {
        return { label: audioDevice.label, value: audioDevice.deviceId };
      });
      temp.unshift({ label: "Disabled", value: "Disabled" });
      chrome.storage.sync.set({ ["MIC_OPTIONS"]: temp });
    } else {
      chrome.runtime.sendMessage({
        [EVENT.MIC_OPTIONS]: [{ label: "Disabled", value: "Disabled" }],
      });
    }
  };

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
          chrome.storage.sync.set({ ["RECORDING_STARTED"]: true });
        }
      }
    } catch (error) {
      console.log("Error accessing the screen: ", error);
    }
  };

  // Saving & downloading chunks into file
  const onSaveRecording = async () => {
    console.log("Recording is ended~~~~~~~~~~~~~~~~~~~~~~~~~~");
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
        window.open(chrome.runtime.getURL("options.html"));

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
    chrome.storage.sync.set({ ["RECORDING_STARTED"]: false });
    setVisibleEditMenu(false); // Closing edit tools menu
  };

  const onCloseModalStartRecording = () => {
    recordingStartTime = new Date().getTime();

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=h264,opus",
      videoBitsPerSecond: Number(qualityDefaultValue),
    });
  };

  const onPauseResume = () => {
    if (mediaRecorder.state === "recording") {
      mediaRecorder.pause();
    } else if (mediaRecorder.state === "paused") {
      mediaRecorder.resume();
    }
  };

  return (
    <div
      // className={`col-span-7 flex flex-col my-auto fixed z-50 ${
      //   foregroundVisiable ? "" : "hidden"
      // } `}
      className={`col-span-7 flex flex-col my-auto fixed z-50`}
    >
      {visibleWebcamDrag && <WebcamDrag cameraDeviceId={cameraSource} />}
      {/* Time counter modal */}
      <TimeCounterModal
        visibleTimeCounterModal={visibleTimeCounterModal}
        countNumber={countNumber}
      />

      {visibleEditMenu && (
        <AnnotationTool
          handleSaveRecording={() => {
            onSaveRecording();
          }}
          handlePauseResume={() => {
            onPauseResume();
          }}
        />
      )}
    </div>
  );
}

export default Foreground;
