import React from "react";
import { fabric } from "fabric";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../utils/constants";

export function arePointsOutOfRange(
  x,
  y,
  canvasWidth = CANVAS_WIDTH,
  canvasHeight = CANVAS_HEIGHT
) {
  return x > canvasWidth || y > canvasHeight || x < 0 || y < 0;
}

export function createRect(x, y, penColor, penSize, readonly = false) {
  const rect = new fabric.Rect({
    left: x,
    top: y,
    originX: "left",
    originY: "top",
    width: 0,
    height: 0,
    fill: "transparent",
    stroke: penColor,
    borderColor: "white",
    strokeWidth: penSize,
    selectable: !readonly,
  });
  rect.set("strokeUniform", true);
  rect.setControlsVisibility({ mtr: false });

  return rect;
}

export function createEllipse(x, y, penColor, penSize, readonly = false) {
  const ellipse = new fabric.Ellipse({
    left: x,
    top: y,
    originX: "left",
    originY: "top",
    rx: 0,
    ry: 0,
    fill: "transparent",
    stroke: penColor,
    strokeWidth: penSize,
    selectable: !readonly,
  });
  ellipse.set("strokeUniform", true);
  ellipse.setControlsVisibility({ mtr: false });

  return ellipse;
}

export function createText(x, y, fontSize, penColor, readonly = false) {
  const text = new fabric.Textbox("Here is Text Editor", {
    left: x,
    top: y,
    originX: "left",
    originY: "top",
    fill: penColor,
    width: 0,
    height: 0,
    selectable: !readonly,
    fontSize,
    lockScalingY: true,
    editable: true,
  });
  text.set({ strokeUniform: true });
  text.setControlsVisibility({
    mtr: false,
    tl: false,
    tr: false,
    bl: false,
    br: false,
    mb: false,
    mt: false,
  });

  return text;
}

export function createTriangle(x, y, penColor, penSize, readonly = false) {
  const triangle = new fabric.Triangle({
    left: x,
    top: y,
    width: 0,
    height: 0,
    fill: "transparent",
    stroke: penColor,
    strokeWidth: penSize,
    selectable: !readonly,
  });
  triangle.set("strokeUniform", true);
  triangle.setControlsVisibility({ mtr: false });

  return triangle;
}

export function resizeRect(rect, origX, origY, x, y) {
  if (x < origX) rect.set({ left: x });
  if (y < origY) rect.set({ top: y });

  rect.set({
    width: Math.abs(origX - x),
    height: Math.abs(origY - y),
  });
}

export function resizeEllipse(ellipse, origX, origY, x, y) {
  if (x < origX) ellipse.set({ left: x });
  if (y < origY) ellipse.set({ top: y });

  ellipse.set({ rx: Math.abs(origX - x) / 2, ry: Math.abs(origY - y) / 2 });
}

export function resizeText(text, origX, x) {
  if (x < origX) text.set({ left: x });

  text.set({
    width: Math.abs(origX - x),
  });
}

export function resizeTriangle(triangle, origX, origY, x, y) {
  if (x < origX) triangle.set({ left: x });
  if (y < origY) triangle.set({ top: y });

  triangle.set({
    width: Math.abs(origX - x),
    height: Math.abs(origY - y),
  });
}
