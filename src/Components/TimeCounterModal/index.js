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
        <p
          className="flex w-full justify-center my-auto not-italic font-bold bg-transparent"
          style={{ fontSize: "150px" }}
        >
          {countNumber}
        </p>
      </Modal>
    </div>
  );
};

export default TimeCounterModal;
