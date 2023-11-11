import React from "react";
import { SHAPE_TYPES } from "../../utils/constants";
import { IoTriangleOutline } from "react-icons/io5";
import { ANNOTATION_TOOL_SELECTION } from "../../utils/constants";
import "./style.css";

const ShapePanel = (props) => {
  const { color, currentSelectedOption, handleCurrentSelectedOption } = props;

  return (
    <>
      <div className="flex flex-col w-auto p-1 items-center">
        <div className="flex flex-col w-auto p-1 items-center">
          <div
            className="m-[10px] h-[100px] w-[150px] border-[6px]"
            style={{
              borderColor:
                currentSelectedOption === ANNOTATION_TOOL_SELECTION.RECT
                  ? color
                  : "black",
            }}
            data-shape={SHAPE_TYPES.RECT}
            onClick={() =>
              handleCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.RECT)
            }
          />
          <div
            className="m-[10px] h-[100px] w-[100px] border-[6px] rounded-full"
            style={{
              borderColor:
                currentSelectedOption === ANNOTATION_TOOL_SELECTION.ELLIPSE
                  ? color
                  : "black",
            }}
            data-shape={SHAPE_TYPES.ELLIPSE}
            onClick={() =>
              handleCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.ELLIPSE)
            }
          />
          <div
            className="m-[10px] font-[#121212]"
            data-shape={SHAPE_TYPES.TRIAGNLE}
          >
            <IoTriangleOutline
              className="h-[100px] w-[100px]"
              style={{
                color:
                  currentSelectedOption === ANNOTATION_TOOL_SELECTION.TRI
                    ? color
                    : "black",
              }}
              onClick={() =>
                handleCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.TRI)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default ShapePanel;
