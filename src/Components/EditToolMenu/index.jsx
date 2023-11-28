import React from "react";
import { Radio, Space } from "antd";

import { MdCrop, MdOutlinePalette } from "react-icons/md";
import { TbMovieOff, TbSticker, TbColorFilter } from "react-icons/tb";
import { GiSettingsKnobs } from "react-icons/gi";
import { HiOutlineMusicalNote } from "react-icons/hi2";

import { LABEL } from "../../utils/constants";
import "./style.css";

const editToolLabels = [
  {
    label: LABEL.TRIM,
    icon: <TbMovieOff className="etm_label" />,
  },
  {
    label: LABEL.CROP,
    icon: <MdCrop className="etm_label" />,
  },
  {
    label: LABEL.BGMUSIC,
    icon: <HiOutlineMusicalNote className="etm_label" />,
  },
  {
    label: LABEL.FINETUNE,
    icon: <GiSettingsKnobs className="etm_label" />,
  },
  {
    label: LABEL.FILTER,
    icon: <TbColorFilter className="etm_label" />,
  },
  {
    label: LABEL.ANNOTATE,
    icon: <MdOutlinePalette className="etm_label" />,
  },
  {
    label: LABEL.STICKER,
    icon: <TbSticker className="etm_label" />,
  },
];

const EditToolMenu = (props) => {
  const { currentTool, handleCurrentTool } = props;

  return (
    <div className="etm_container">
      <Radio.Group
        onChange={(e) => handleCurrentTool(e.target.value)}
        value={currentTool}
      >
        <Space direction="vertical">
          {editToolLabels.map((editTool, index) => {
            return (
              <Radio.Button
                style={{ height: "auto", padding: "0" }}
                value={editTool.label}
                key={index}
              >
                <div className="etm_icon">
                  {editTool.icon}
                  <span className="etm_la">{editTool.label}</span>
                </div>
              </Radio.Button>
            );
          })}
        </Space>
      </Radio.Group>
    </div>
  );
};

export default EditToolMenu;
