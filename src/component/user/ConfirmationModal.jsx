// components/ConfirmationModal.js
import React from "react";
import { Modal } from "flowbite-react";

const ConfirmationModal = ({ showModal, onClose, message }) => {
  return (
    <Modal show={showModal} onClose={onClose}>
      <Modal.Header>Payment Successful</Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg"
          onClick={onClose}
        >
          OK
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
