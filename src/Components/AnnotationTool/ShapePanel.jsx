import React from "react";
import { SHAPE_TYPES } from "../../utils/constants";
import { IoTriangleOutline } from "react-icons/io5";
import { ANNOTATION_TOOL_SELECTION } from "../../utils/constants";
import "./style.css";

const ShapePanel = (props) => {
  const { color, currentSelectedOption, handleCurrentSelectedOption } = props;

  return (
    <>
      {/* <div className="flex flex-col w-auto p-1 items-center"> */}
      <div className="sp_container">
        <div
          style={{
            borderColor:
              currentSelectedOption === ANNOTATION_TOOL_SELECTION.RECT
                ? color
                : "black",
            margin: "10px",
            height: "96px",
            width: "144px",
            borderWidth: "2px",
          }}
          data-shape={SHAPE_TYPES.RECT}
          onClick={() =>
            handleCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.RECT)
          }
        />
        <div
          style={{
            borderColor:
              currentSelectedOption === ANNOTATION_TOOL_SELECTION.ELLIPSE
                ? color
                : "black",
            margin: "10px",
            height: "96px",
            width: "144px",
            borderWidth: "2px",
            borderRadius: "50%",
          }}
          data-shape={SHAPE_TYPES.ELLIPSE}
          onClick={() =>
            handleCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.ELLIPSE)
          }
        />
        <div data-shape={SHAPE_TYPES.TRIAGNLE} style={{ color: "#121212" }}>
          <IoTriangleOutline
            style={{
              color:
                currentSelectedOption === ANNOTATION_TOOL_SELECTION.TRI
                  ? color
                  : "black",
              margin: "7px",
              height: "96px",
              width: "96px",
            }}
            onClick={() =>
              handleCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.TRI)
            }
          />
        </div>
      </div>
      {/* </div> */}
    </>
  );
};
export default ShapePanel;
