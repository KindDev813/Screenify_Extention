import React, { useState, useEffect } from "react";
import WebcamDrag from "../../Components/WebcamDrag";
import TimeCounterModal from "../../Components/TimeCounterModal";
import AnnotationTool from "../../Components/AnnotationTool";

import { alertModal, isEmpty } from "../../utils/functions";
import { EVENT } from "../../utils/constants";

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
  const [foregroundVisiable, setForegroundVisible] = useState(false);
  const [visibleWebcamDrag, setVisibleWebcamDrag] = useState(false); // Webcam Drag enable/disable

  const onPauseResume = () => {};

  useEffect(() => {
    chrome.storage.sync.get("VISIBLE_WEBCAM_DRAG", function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setVisibleWebcamDrag(result.VISIBLE_WEBCAM_DRAG);
      }
    });

    chrome.storage.sync.get("RECORDING_STARTED", function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setRecordingStarted(result.RECORDING_STARTED);
      }
    });

    chrome.storage.sync.get("RECORDING_MODE", function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setRecordingMode(result.RECORDING_MODE);
      }
    });

    chrome.storage.sync.get("CAMERA_SOURCE", function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setCameraSource(result.CAMERA_SOURCE);
      }
    });

    chrome.storage.sync.get("QUALITY_VALUE", function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setQualityDefaultValue(result.QUALITY_VALUE);
      }
    });

    chrome.storage.sync.get("MIC_SOURCE", function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        setMicrophoneSource(result.MIC_SOURCE);
      }
    });

    const storageListener = (changes, areaName) => {
      if (areaName !== "sync") return;
      if (changes.VISIBLE_WEBCAM_DRAG) {
        setVisibleWebcamDrag(changes.VISIBLE_WEBCAM_DRAG.newValue);
      }

      if (changes.RECORDING_STARTED) {
        setRecordingStarted(changes.RECORDING_STARTED.newValue);
      }

      if (changes.RECORDING_MODE) {
        setRecordingMode(changes.RECORDING_MODE.newValue);
      }

      if (changes.CAMERA_SOURCE) {
        setCameraSource(changes.CAMERA_SOURCE.newValue);
      }

      if (changes.MIC_SOURCE) {
        setMicrophoneSource(changes.MIC_SOURCE.newValue);
      }

      if (changes.QUALITY_VALUE) {
        setQualityDefaultValue(changes.QUALITY_VALUE.newValue);
      }
    };

    chrome.storage.onChanged.addListener(storageListener);
    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
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

    getDeviceName();
  }, []);

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
    !recordingStarted ? onStartRecording() : onSaveRecording();
  }, [recordingStarted]);

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

  // Time counter
  useEffect(() => {
    let temp = 4;
    function updateCountdown() {
      switch (temp) {
        case 0:
          onCloseModalStartRecording();
          // setVisibleEditMenu(true);
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
          // setVisibleEditMenu(true);
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
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        // recordingEndTime = new Date().getTime();
        // localStorage.setItem(LOCAL_STORAGE.BLOB_LINKS, JSON.stringify(url));
        // localStorage.setItem(
        //   LOCAL_STORAGE.RECORDING_DURATION,
        //   (recordingEndTime - recordingStartTime).toString()
        // );
        // navigate("/editMedia");

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
    // setVisibleEditMenu(false); // Closing edit tools menu
  };

  const onCloseModalStartRecording = () => {
    recordingStartTime = new Date().getTime();

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=h264,opus",
      videoBitsPerSecond: Number(qualityDefaultValue),
    });
  };

  return (
    <div
      className={`col-span-7 flex flex-col my-auto fixed z-50 ${
        foregroundVisiable ? "" : "hidden"
      } `}
    >
      {visibleWebcamDrag && <WebcamDrag cameraDeviceId={cameraSource} />}

      {/* Time counter modal */}
      <TimeCounterModal
        visibleTimeCounterModal={visibleTimeCounterModal}
        countNumber={countNumber}
      />
      {/* <AnnotationTool
        handleSaveRecording={() => {
          onSaveRecording();
        }}
        handlePauseResume={() => {
          onPauseResume();
        }}
      /> */}
    </div>
  );
}

export default Foreground;
