import React, { useState, useEffect } from "react";
import { Button } from "antd";
import Draggable from "react-draggable";
import { XCOUNTERS } from "../../utils/constants";
import "./style.css";

const WebcamDrag = (props) => {
  const { cameraDeviceId } = props;
  const [sizeWebcamDrag, setSizeWebcamDrag] = useState(200); // Webcam Drag default size : 200 px

  useEffect(() => {
    handleCameraSource();
  }, [cameraDeviceId]);

  const handleCameraSource = async () => {
    try {
      const constraints = {
        audio: false,
        video: {
          deviceId: cameraDeviceId ? cameraDeviceId : undefined,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoElement = document.querySelector("video#webcam_video");
      videoElement.srcObject = stream;
    } catch (error) {
      console.log("Error opening video camera.", error);
    }
  };

  return (
    <div className="wd_container">
      <Draggable>
        <div
          style={{
            width: sizeWebcamDrag,
            height: sizeWebcamDrag,
            backgroundColor: "black",
          }}
          className="wd_draggable"
        >
          <div>
            <video
              id="webcam_video"
              autoPlay
              style={{
                width: sizeWebcamDrag,
                height: sizeWebcamDrag,
                borderRadius: "50%",
              }}
            />

            <div className="wd_zoom_btn">
              {XCOUNTERS.map((xCounter) => {
                return (
                  <Button
                    className="wd_zoom_each_btn"
                    type="primary"
                    shape="circle"
                    key={xCounter}
                    onClick={() => setSizeWebcamDrag(200 * xCounter)}
                  >
                    {xCounter}x
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default WebcamDrag;
