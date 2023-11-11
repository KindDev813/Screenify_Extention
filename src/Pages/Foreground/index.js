import React, { useState } from "react";
import WebcamDrag from "../../Components/WebcamDrag";
import AnnotationTool from "../../Components/AnnotationTool";

function Foreground() {
  const [cameraSource, setCameraSource] = useState("default"); // Camera source deviceId
  const onSaveRecording = () => {};
  const onPauseResume = () => {};

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
