import React, { useRef, useState, useEffect } from "react";
import { fabric } from "fabric";

import Paint from "../Paint";
import { KEY_CODE, ANNOTATION_TOOL_SELECTION } from "../../utils/constants";
import "./style.css";

// 0: Delete, 1: TextEditor, 2: Rect, 3: Ellipse, 4: Triangle, 5: FreeHand 6: Seleted, 7:Undo

const AnnotationPlayField = (props) => {
  const {
    nowColor,
    nowSize,
    currentSelectedOption,
    handleCurrentSelectedOption,
  } = props;

  const [readonly, setReadonly] = useState(false);
  const [canvas, setCanvas] = useState();
  const [canvasState, setCanvasState] = useState([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(-1);

  const canvasEl = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current);
    setCanvas(canvas);

    const handleKey = (event) => {
      if (event.keyCode === KEY_CODE.DELETE) {
        const object = canvas.getActiveObject();

        if (object) {
          canvas.remove(object);
        }
      }
    };

    window.addEventListener("keyup", handleKey);

    return () => {
      setCanvas(undefined);
      canvas.dispose();
      window.removeEventListener("keyup", handleKey);
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;

    canvas.selection =
      currentSelectedOption === ANNOTATION_TOOL_SELECTION.IS_SELETED; // Selected canvas

    if (currentSelectedOption === ANNOTATION_TOOL_SELECTION.DELETE) {
      canvas.clear();
    }

    if (currentSelectedOption === ANNOTATION_TOOL_SELECTION.UNDO) {
      if (currentStateIndex <= 0) {
        return;
      }

      canvas.loadFromJSON(canvasState[currentStateIndex - 1], () => {
        canvas.renderAll();
        setCurrentStateIndex(currentStateIndex - 1);
      });

      handleCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.IS_NOT_SELECTED);
    }
  }, [currentSelectedOption, canvas]);

  const handleCanvasDrawEnd = () => {
    // handleCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.IS_SELETED);
  };

  const updateCanvasState = (value) => {
    let jsonData = value.toJSON();
    let canvasAsJson = JSON.stringify(jsonData);

    if (
      currentStateIndex !== -1 &&
      currentStateIndex < canvasState.length - 1
    ) {
      setCanvasState(canvasState.slice(0, currentStateIndex + 1));
    }

    setCanvasState((prevState) => [...prevState, canvasAsJson]);
    setCurrentStateIndex(canvas.getObjects().length);
  };

  return (
    <>
      <Paint
        className="apf_container"
        ref={canvasEl}
        canvas={canvas}
        drawMode={currentSelectedOption}
        penColor={nowColor}
        penSize={nowSize}
        readonly={readonly}
        onDrawEnd={handleCanvasDrawEnd}
        handleUpdateCanvasState={(value) => updateCanvasState(value)}
      ></Paint>
    </>
  );
};

export default AnnotationPlayField;
