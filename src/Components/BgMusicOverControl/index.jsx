import React from "react";
import { Typography } from "antd";
import "./style.css";

const { Title } = Typography;

const BgMusicOverControl = (props) => {
  const { overMusic, handleOverMusic } = props;

  return (
    <div className="bmoc_container">
      <input
        type="file"
        style={{
          fontWeight: "bold",
          fontSize: "16px",
          width: "102px",
          marginBottom: "10px",
        }}
        onChange={(e) => handleOverMusic(e.target.files[0])}
      />
      <Title level={5}>
        {overMusic
          ? `Chosen file: ${overMusic.name}`
          : "Click here to select an audio file!"}
      </Title>
    </div>
  );
};

export default BgMusicOverControl;
