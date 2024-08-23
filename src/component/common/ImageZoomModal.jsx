import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ImageZoomModal = ({ isOpen, onClose, ImageSrc }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-35">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-4 text-white text-2xl"
        >
          &times;
        </button>
      </div>
      <Zoom>
        <img
          src={ImageSrc}
          alt="Full Size"
          className="w-full h-auto max-w-3xl"
        />
      </Zoom>{" "}
    </div>
  );
};

export default ImageZoomModal;
