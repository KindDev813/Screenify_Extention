import React from "react";
import {
  CAMERA_ALLOWED_MESSAGE,
  CAMERA_BLOCKED_MESSAGE,
} from "../utils/constants";
import { Select } from "antd";

const LabelSelect = (props) => {
  const { label, options, allowed, onChangeDeviceSource } = props;
  return (
    <>
      <p className="mt-5 text-start font-bold">{label}</p>
      {/* Camera source */}
      <Select
        defaultValue="Disabled"
        onChange={(e) => onChangeDeviceSource(e)}
        options={options}
        className="mt-2 w-full h-[40px]"
        disabled={!allowed}
      />
      {allowed ? (
        <p className="mt-1 text-start text-[#31a15c]">
          {CAMERA_ALLOWED_MESSAGE}
        </p>
      ) : (
        <p className="mt-1 text-start text-[#fd4f4f]">
          {CAMERA_BLOCKED_MESSAGE}
        </p>
      )}
    </>
  );
};

export default LabelSelect;
