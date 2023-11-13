import React, { useState, useEffect } from "react";
import WebcamDrag from "../../Components/WebcamDrag";
import AnnotationTool from "../../Components/AnnotationTool";

let cameraDeviceCounter = 0,
  micDeviceCounter = 0;

function Foreground() {
  const [cameraSource, setCameraSource] = useState("default"); // Camera source deviceId
  const onSaveRecording = () => {};
  const onPauseResume = () => {};

  useEffect(() => {
    const getDeviceName = async () => {
      console.log("1");
      await navigator.mediaDevices.enumerateDevices().then(async (devices) => {
        console.log("2");
        devices.forEach((device) => {
          console.log("3");
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
        // setVideoDeviceExisting(true);
        // setAudioDeviceExisting(true);
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
          // setVideoDeviceExisting(true);
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
          // setAudioDeviceExisting(true);
        }
      }
    };

    getDeviceName();
  }, []);

  return (
    <div className="col-span-7 flex flex-col my-auto fixed z-50">
      {/* <WebcamDrag cameraDeviceId={cameraSource} />
      <AnnotationTool
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
