import React from "react";
import { SHAPE_TYPES } from "../../utils/constants";
import {
  IoTriangleOutline,
  IoEllipseOutline,
  IoSquareOutline,
} from "react-icons/io5";
import { ANNOTATION_TOOL_SELECTION } from "../../utils/constants";
import "./style.css";

const ShapePanel = (props) => {
  const { color, currentSelectedOption, handleCurrentSelectedOption } = props;

  return (
    <>
      {/* <div className="flex flex-col w-auto p-1 items-center"> */}
      <div className="sp_container">
        <div data-shape={SHAPE_TYPES.RECT} style={{ color: "#121212" }}>
          <IoSquareOutline
            style={{
              color:
                currentSelectedOption === ANNOTATION_TOOL_SELECTION.RECT
                  ? color
                  : "black",
              margin: "7px",
              height: "96px",
              width: "96px",
            }}
            onClick={() =>
              currentSelectedOption === ANNOTATION_TOOL_SELECTION.RECT
                ? handleCurrentSelectedOption(
                    ANNOTATION_TOOL_SELECTION.IS_NOT_SELECTED
                  )
                : handleCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.RECT)
            }
          />
        </div>
        <div data-shape={SHAPE_TYPES.ELLIPSE} style={{ color: "#121212" }}>
          <IoEllipseOutline
            style={{
              color:
                currentSelectedOption === ANNOTATION_TOOL_SELECTION.ELLIPSE
                  ? color
                  : "black",
              margin: "7px",
              height: "96px",
              width: "96px",
            }}
            onClick={() =>
              currentSelectedOption === ANNOTATION_TOOL_SELECTION.ELLIPSE
                ? handleCurrentSelectedOption(
                    ANNOTATION_TOOL_SELECTION.IS_NOT_SELECTED
                  )
                : handleCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.ELLIPSE)
            }
          />
        </div>
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
              currentSelectedOption === ANNOTATION_TOOL_SELECTION.TRI
                ? handleCurrentSelectedOption(
                    ANNOTATION_TOOL_SELECTION.IS_NOT_SELECTED
                  )
                : handleCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.TRI)
            }
          />
        </div>
      </div>
      {/* </div> */}
    </>
  );
};
export default ShapePanel;
