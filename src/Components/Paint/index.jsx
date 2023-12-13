import React, { useEffect } from "react";

import {
  arePointsOutOfRange,
  createEllipse,
  createRect,
  createText,
  createTriangle,
  resizeEllipse,
  resizeRect,
  resizeText,
  resizeTriangle,
} from "./func";
import { ANNOTATION_TOOL_SELECTION } from "../../utils/constants";

const Paint = React.forwardRef(
  (
    {
      canvas,
      drawMode,
      penColor,
      penSize,
      onDrawEnd,
      readonly = false,
      handleUpdateCanvasState,
    },
    ref
  ) => {
    // 1: TextEditor, 2: Rect, 3:Ellipse 4: FreeHand 5: Seleted

    useEffect(() => {
      if (!canvas) return;

      let drawing = false;
      let origX = 0;
      let origY = 0;

      let rect = undefined;
      let ellipse = undefined;
      let text = undefined;
      let triangle = undefined;

      if (drawMode === ANNOTATION_TOOL_SELECTION.FREE_HAND) {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = penColor;
        canvas.freeDrawingBrush.width = penSize;
      } else {
        canvas.isDrawingMode = false;
      }

      const handleCanvasMouseDown = (event) => {
        if (drawMode === ANNOTATION_TOOL_SELECTION.IS_SELETED) return;
        drawing = true;

        const pointer = canvas.getPointer(event.e);
        origX = pointer.x;
        origY = pointer.y;

        switch (drawMode) {
          case ANNOTATION_TOOL_SELECTION.TEXT_EDITOR:
            if (event.target?.type === "textbox") {
              console.log("This is text editor");
            } else {
              text = createText(origX, origY, penSize * 6, penColor, readonly);
              canvas.add(text);
              canvas.setActiveObject(text);
            }
            break;
          case ANNOTATION_TOOL_SELECTION.RECT:
            rect = createRect(origX, origY, penColor, penSize, readonly);
            canvas.add(rect);
            canvas.setActiveObject(rect);
            break;
          case ANNOTATION_TOOL_SELECTION.ELLIPSE:
            ellipse = createEllipse(origX, origY, penColor, penSize, readonly);
            canvas.add(ellipse);
            canvas.setActiveObject(ellipse);
            break;
          case ANNOTATION_TOOL_SELECTION.TRI:
            triangle = createTriangle(
              origX,
              origY,
              penColor,
              penSize,
              readonly
            );
            canvas.add(triangle);
            canvas.setActiveObject(triangle);
            break;
        }

        canvas.renderAll();
      };

      const handleCanvasMouseMove = (event) => {
        if (!drawing) return;

        const pointer = canvas.getPointer(event.e);
        if (arePointsOutOfRange(pointer.x, pointer.y)) return;

        switch (drawMode) {
          case ANNOTATION_TOOL_SELECTION.TEXT_EDITOR:
            if (text) resizeText(text, origX, pointer.x);
            break;
          case ANNOTATION_TOOL_SELECTION.RECT:
            if (rect) resizeRect(rect, origX, origY, pointer.x, pointer.y);
            break;
          case ANNOTATION_TOOL_SELECTION.ELLIPSE:
            if (ellipse)
              resizeEllipse(ellipse, origX, origY, pointer.x, pointer.y);
            break;
          case ANNOTATION_TOOL_SELECTION.TRI:
            if (triangle)
              resizeTriangle(triangle, origX, origY, pointer.x, pointer.y);
            break;
        }
        canvas.renderAll();
      };

      const handleCanvasMouseUp = (event) => {
        drawing = false;
        onDrawEnd();

        canvas.renderAll();
      };

      canvas.on("mouse:down", handleCanvasMouseDown);
      canvas.on("mouse:move", handleCanvasMouseMove);
      canvas.on("mouse:up", handleCanvasMouseUp);
      canvas.on("object:modified", handleUpdateCanvasState(canvas));
      canvas.on("object:added", handleUpdateCanvasState(canvas));

      return () => {
        canvas.off("mouse:down");
        canvas.off("mouse:move");
        canvas.off("mouse:up");
        canvas.on("object:modified");
        canvas.on("object:added");
      };
    }, [canvas, drawMode, penSize, penColor]);

    return (
      <canvas width={window.innerWidth} height={window.innerHeight} ref={ref} />
    );
  }
);

export default Paint;
