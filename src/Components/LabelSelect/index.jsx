import React from "react";
import {
  CAMERA_ALLOWED_MESSAGE,
  CAMERA_BLOCKED_MESSAGE,
} from "../../utils/constants";
import { Select } from "antd";
import "./style.css";

const LabelSelect = (props) => {
  const { label, options, allowed, value, onChangeDeviceSource } = props;
  return (
    <>
      <p className="ls_container">{label}</p>
      {/* Camera source */}
      <Select
        defaultValue="Disabled"
        onChange={(e) => onChangeDeviceSource(e)}
        options={options}
        disabled={!allowed}
        value={value}
        style={{ marginTop: "0.5rem", width: "100%", height: "40px" }}
      />
      {allowed ? (
        <p className="ls_message_active">{CAMERA_ALLOWED_MESSAGE}</p>
      ) : (
        <p className="ls_message_inactive">{CAMERA_BLOCKED_MESSAGE}</p>
      )}
    </>
  );
};

export default LabelSelect;
