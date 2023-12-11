import React, { useState } from "react";
import { FloatButton, ColorPicker, Popover, Slider } from "antd";
import { IoShapesOutline } from "react-icons/io5";
import {
  MdOutlineVolumeUp,
  MdOutlineVolumeOff,
  MdMicNone,
  MdMicOff,
  MdReply,
  MdOutlinePause,
  MdOutlinePlayArrow,
  MdCheck,
  MdClose,
  MdOutlineModeEditOutline,
  MdTitle,
  MdDeleteOutline,
  MdOutlinePalette,
} from "react-icons/md";

import ShapePanel from "./ShapePanel";
import AnnotationPlayField from "./AnnotationPlayField";
import { ANNOTATION_TOOL_SELECTION } from "../../utils/constants";

import "./style.css";

const AnnotationTool = (props) => {
  const { handleSaveRecording, handlePauseResume } = props;
  const [switchDropEditMenu, setSwitchDropEditMenu] = useState(false); // After pressing pause button
  const [visibleVolumeTrack, setVisibleVolumeTrack] = useState(true); // enable/disable audio track
  const [visibleMicrophoneTrack, setVisibleMicrophoneTrack] = useState(true); // enable/disable microphone track
  const [currentSelectedOption, setCurrentSelectedOption] = useState(
    ANNOTATION_TOOL_SELECTION.IS_NOT_SELECTED
  ); // Now, this is the option you selected. 0: Delete, 1: TextEditor, 2: Rect, 3: Ellipse, 4: Triangle, 5: FreeHand 6: Seleted, 7:Undo
  const [nowColor, setNowColor] = useState("#ff0000"); // Setted color by Color Picker
  const [nowSize, setNowSize] = useState(10); // Setted size by pencil scroll
  const [annotationToolsOpen, setAnnotationToolsOpen] = useState(false);

  const annotationBadge = {
    dot: true,
    color: nowColor,
  };

  const freeHandContent = (
    <div>
      <Slider
        vertical
        min={1}
        max={50}
        defaultValue={nowSize}
        style={{ display: "inline-block", height: 100 }}
        onChange={(value) => setNowSize(value)}
      />
    </div>
  );

  const handlePauseResumeRecording = () => {
    setSwitchDropEditMenu(!switchDropEditMenu);
    handlePauseResume();
  };
  return (
    <>
      {!switchDropEditMenu ? (
        <FloatButton.Group
          type="primary"
          style={{
            left: 20,
            bottom: 20,
          }}
        >
          {/* <FloatButton
                  icon={
                    visibleMicrophoneTrack ? (
                      <MdOutlineVolumeUp />
                    ) : (
                      <MdOutlineVolumeOff />
                    )
                  }
                  onClick={() =>
                    setVisibleMicrophoneTrack(!visibleMicrophoneTrack)
                  }
                />
                <FloatButton
                  icon={visibleVolumeTrack ? <MdMicNone /> : <MdMicOff />}
                  onClick={() => setVisibleVolumeTrack(!visibleVolumeTrack)}
                /> */}

          <FloatButton.Group
            open={annotationToolsOpen}
            trigger="click"
            type="primary"
            style={{
              left: 20,
              bottom: 20,
              marginBottom: 55, // 165
            }}
            icon={<MdOutlinePalette />}
            onClick={() => setAnnotationToolsOpen(!annotationToolsOpen)}
          >
            <FloatButton
              icon={<MdDeleteOutline />}
              onClick={() =>
                currentSelectedOption === ANNOTATION_TOOL_SELECTION.DELETE
                  ? setCurrentSelectedOption(
                      ANNOTATION_TOOL_SELECTION.IS_NOT_SELECTED
                    )
                  : setCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.DELETE)
              }
            />
            <FloatButton
              icon={<MdReply />}
              onClick={() =>
                currentSelectedOption === ANNOTATION_TOOL_SELECTION.UNDO
                  ? setCurrentSelectedOption(
                      ANNOTATION_TOOL_SELECTION.IS_NOT_SELECTED
                    )
                  : setCurrentSelectedOption(ANNOTATION_TOOL_SELECTION.UNDO)
              }
            />
            <FloatButton
              className="color_picker"
              icon={
                <ColorPicker
                  size="small"
                  style={{ margin: "auto" }}
                  value={nowColor}
                  onChange={(value, hex) => setNowColor(hex)}
                />
              }
              onClick={() => {}}
            ></FloatButton>
            <FloatButton
              icon={<MdTitle />}
              badge={
                currentSelectedOption ===
                  ANNOTATION_TOOL_SELECTION.TEXT_EDITOR && annotationBadge
              }
              onClick={() =>
                currentSelectedOption === ANNOTATION_TOOL_SELECTION.TEXT_EDITOR
                  ? setCurrentSelectedOption(
                      ANNOTATION_TOOL_SELECTION.IS_NOT_SELECTED
                    )
                  : setCurrentSelectedOption(
                      ANNOTATION_TOOL_SELECTION.TEXT_EDITOR
                    )
              }
            />
            <Popover
              placement="rightTop"
              trigger={"hover"}
              content={
                <ShapePanel
                  color={nowColor}
                  currentSelectedOption={currentSelectedOption}
                  handleCurrentSelectedOption={(value) => {
                    setCurrentSelectedOption(value);
                  }}
                />
              }
            >
              <FloatButton
                icon={<IoShapesOutline />}
                badge={
                  (currentSelectedOption === ANNOTATION_TOOL_SELECTION.RECT ||
                    currentSelectedOption ===
                      ANNOTATION_TOOL_SELECTION.ELLIPSE ||
                    currentSelectedOption === ANNOTATION_TOOL_SELECTION.TRI) &&
                  annotationBadge
                }
              />
            </Popover>
            <Popover
              placement="rightTop"
              trigger={"hover"}
              content={freeHandContent}
            >
              <FloatButton
                icon={<MdOutlineModeEditOutline />}
                badge={
                  currentSelectedOption ===
                    ANNOTATION_TOOL_SELECTION.FREE_HAND && annotationBadge
                }
                onClick={() =>
                  currentSelectedOption === ANNOTATION_TOOL_SELECTION.FREE_HAND
                    ? setCurrentSelectedOption(
                        ANNOTATION_TOOL_SELECTION.IS_NOT_SELECTED
                      )
                    : setCurrentSelectedOption(
                        ANNOTATION_TOOL_SELECTION.FREE_HAND
                      )
                }
              />
            </Popover>
          </FloatButton.Group>

          <FloatButton
            icon={<MdOutlinePause />}
            onClick={() => {
              handlePauseResumeRecording();
            }}
          />
        </FloatButton.Group>
      ) : (
        <FloatButton.Group
          // trigger="click"
          type="primary"
          style={{
            left: 20,
            bottom: 20,
            zIndex: 40,
          }}
        >
          <FloatButton
            icon={<MdClose />}
            onClick={() => {
              handleSaveRecording();
            }}
          />
          <FloatButton
            icon={<MdCheck />}
            onClick={() => {
              handleSaveRecording();
            }}
          />
          <FloatButton
            icon={<MdOutlinePlayArrow />}
            onClick={() => {
              handlePauseResumeRecording();
            }}
          />
        </FloatButton.Group>
      )}
      <div
        className="at_container"
        style={{
          pointerEvents:
            currentSelectedOption === ANNOTATION_TOOL_SELECTION.IS_NOT_SELECTED
              ? "none"
              : "all",
        }}
      >
        <AnnotationPlayField
          nowColor={nowColor}
          nowSize={nowSize}
          currentSelectedOption={currentSelectedOption}
          handleCurrentSelectedOption={(value) => {
            setCurrentSelectedOption(value);
          }}
        />
      </div>
    </>
  );
};

export default AnnotationTool;
