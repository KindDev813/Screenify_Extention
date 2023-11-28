import React from "react";
import { Modal } from "antd";
import "./style.css";

const TimeCounterModal = (props) => {
  const { visibleTimeCounterModal, countNumber } = props;

  return (
    <div className="absolute">
      <Modal
        centered
        closable={false}
        footer={null}
        open={visibleTimeCounterModal}
        width={"275px"}
        className="time_counter_modal"
      >
        <p className="tcm_word">{countNumber}</p>
      </Modal>
    </div>
  );
};

export default TimeCounterModal;
