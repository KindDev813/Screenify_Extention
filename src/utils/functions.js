import React from "react";
import { Modal } from "antd";

export const EventBus = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  dispatch(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event, callback) {
    document.removeEventListener(event, callback);
  },
};

export const alertModal = (value) => {
  Modal.error({
    title: value,
  });
};

export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return !obj;
  else if (typeof obj === "string" || Array.isArray(obj))
    return obj.length === 0;
  else if (typeof obj === "object") return Object.keys(obj).length === 0;
  else return !obj;
};
