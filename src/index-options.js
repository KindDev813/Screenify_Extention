import React from "react";
import { render } from "react-dom";

import Options from "./Pages/Options";

//  useEffect(() => {
//    const messageListener = (request, sender, sendResponse) => {
//      if (isEmpty(request)) return;
//      switch (request.type) {
//        case EVENT.PRESS_START_BUTTON:
//          setPressStartButton(request.data);
//          break;
//        case EVENT.VISIBLE_WEBCAM_DRAG:
//          setVisibleWebcamDrag(request.data);
//          break;
//        case EVENT.RECORDING_MODE:
//          setRecordingMode(request.data);
//          break;
//        case EVENT.CAMERA_SOURCE:
//          setCameraSource(request.data);
//          break;
//        case EVENT.QUALITY_VALUE:
//          setQualityDefaultValue(request.data);
//          break;
//        case EVENT.MIC_SOURCE:
//          setMicrophoneSource(request.data);
//          break;
//      }
//    };

//    chrome.runtime.onMessage.addListener(messageListener);
//    return () => {
//      chrome.runtime.onMessage.removeListener(messageListener);
//    };
//  }, []);
render(<Options />, document.querySelector("#options"));
