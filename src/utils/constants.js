import React from "react";

export const CAMERA_ALLOWED_MESSAGE = "You can use your device!";
export const CAMERA_BLOCKED = "Please allow permission of your device!";
export const MICROPHONE_ALLOWED = "You can use your microphone!";
export const MICROPHONE_BLOCKED = "Please allow permission of your microphone!";

export const LABEL = {
  FULL_SCREEN: "Full Screen",
  WINDOW: "Window",
  CURRENT_TAB: "Current Tab",
  CAMERA_ONLY: "Camera only",
  CAMERA: "Camera",
  MICROPHONE: "Microphone",
  RECORDING_QUALITY: "Recording quality",
  TRIM: "Trim",
  CROP: "Crop",
  BGMUSIC: "Music Over",
  FINETUNE: "Finetune",
  FILTER: "Filter",
  ANNOTATE: "Annotate",
  STICKER: "Sticker",
};

export const QUALITYOPTIONS = [
  {
    label: "Low",
    value: "100000",
  },
  {
    label: "Medium",
    value: "3000000",
  },
  {
    label: "High",
    value: "5000000",
  },
];

export const XCOUNTERS = [1, 1.5, 2];

export const SHAPE_TYPES = {
  RECT: "rect",
  ELLIPSE: "ellipse",
  TRIAGNLE: "triangle",
};

export const DEFAULTS_SHAPE_VALUE = {
  RECT: {
    STROKE: "#000000",
    FILL: "#0000",
    WIDTH: 150,
    HEIGHT: 100,
    ROTATION: 0,
    STROKEWIDTH: 2,
  },
  CIRCLE: {
    STROKE: "#000000",
    FILL: "#0000",
    RADIUS: 50,
    STROKEWIDTH: 2,
  },
};

export const LIMITS_SHAPE_VALUE = {
  RECT: {
    MAX: 1000,
    MIN: 10,
  },
  CIRCLE: {
    MAX: 500,
    MIN: 5,
  },
};

export const KEY_CODE = {
  RETURN: 13,
  ESCAPE: 27,
  DELETE: 46,
};

// 0: Delete, 1: TextEditor, 2: Rect, 3: Ellipse, 4: Triangle, 5: FreeHand 6: Seleted, 7:Undo
export const ANNOTATION_TOOL_SELECTION = {
  DELETE: "delete",
  TEXT_EDITOR: "text_editor",
  RECT: "rectangle",
  ELLIPSE: "ellipse",
  TRI: "triangle",
  FREE_HAND: "free_hand",
  IS_SELETED: "is_selected",
  UNDO: "undo",
  IS_NOT_SELECTED: "is_not_selected",
};

export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;

export const LOCAL_STORAGE = {
  BLOB_LINKS: "get_blob_link",
  RECORDING_DURATION: "recording_duration",
  VIDEO_WIDTH: "video_width",
  VIDEO_HEIGHT: "video_height",
};

export const DRAG_DATA_KEY = "__drag_data_payload__";

export const EVENT = {
  CAMERA_ALLOWED: "cameraAllowed",
  MIC_ALLOWED: "micAllowed",
  CAMERA_OPTIONS: "cameraOptions",
  MIC_OPTIONS: "micOptions",
  POPUP_ALLOWED: "popupAllowed",
};
