// components/AlertModal.js
import React from "react";
import { Modal, Button } from "flowbite-react";

const AlertModal = ({ showModal, onClose, message }) => {
  return (
    <Modal show={showModal} onClose={onClose} size="sm" >
      <Modal.Header className="text-center">Alert</Modal.Header>
      <Modal.Body className="flex flex-col items-center justify-center text-center">
        <div className="mb-4">
          <h2>{message}</h2>
          <Button onClick={onClose} className="mt-4 ">
            Close
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AlertModal;
