import React from "react";
import { Button } from "flowbite-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      id="hs-custom-backdrop-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70"
      role="dialog"
      aria-labelledby="hs-custom-backdrop-label"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <div className="p-4 border-b">
          <h3 id="hs-custom-backdrop-label" className="font-bold text-gray-800">
            {title}
          </h3>
        </div>
        <div className="p-4">
          <p className="text-gray-800">{message}</p>
        </div>
        <div className="flex justify-end gap-x-2 p-4 border-t">
          <Button
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
