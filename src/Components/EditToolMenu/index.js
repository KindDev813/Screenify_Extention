import React from "react";
import { Radio, Space } from "antd";

import { MdCrop, MdOutlinePalette } from "react-icons/md";
import { TbMovieOff, TbSticker, TbColorFilter } from "react-icons/tb";
import { GiSettingsKnobs } from "react-icons/gi";
import { HiOutlineMusicalNote } from "react-icons/hi2";

import { LABEL } from "../../utils/constants";

const editToolLabels = [
  {
    label: LABEL.TRIM,
    icon: <TbMovieOff style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.CROP,
    icon: <MdCrop style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.BGMUSIC,
    icon: (
      <HiOutlineMusicalNote style={{ fontSize: "30px" }} className="mx-auto" />
    ),
  },
  {
    label: LABEL.FINETUNE,
    icon: <GiSettingsKnobs style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.FILTER,
    icon: <TbColorFilter style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.ANNOTATE,
    icon: <MdOutlinePalette style={{ fontSize: "30px" }} className="mx-auto" />,
  },
  {
    label: LABEL.STICKER,
    icon: <TbSticker style={{ fontSize: "30px" }} className="mx-auto" />,
  },
];

const EditToolMenu = (props) => {
  const { currentTool, handleCurrentTool } = props;

  return (
    <div className="flex col-span-1 justify-center h-full items-center border-2 border-[#00000057] rounded-lg">
      <Radio.Group
        onChange={(e) => handleCurrentTool(e.target.value)}
        value={currentTool}
      >
        <Space direction="vertical">
          {editToolLabels.map((editTool, index) => {
            return (
              <Radio.Button
                className="h-auto !p-0 "
                value={editTool.label}
                key={index}
              >
                <div className="flex flex-col py-1 sm:py-2 md:py-3 justify-center h-full min-w-[50px] w-full sm:w-[50px] lg:w-[70px] xl:w-[90px] 2xl:w-[95px]">
                  {editTool.icon}
                  <span className="text-[12px] whitespace-nowrap">
                    {editTool.label}
                  </span>
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
