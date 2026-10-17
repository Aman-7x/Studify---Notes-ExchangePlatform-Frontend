import React from "react";
import { useNavigate } from "react-router-dom";
import "./LimitExceededModal.css";
const LimitExceededModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate("/uploadnotes");
    onClose();
  };

  return (
    <div className="limit-modal-backdrop" onClick={onClose}>
      <div className="limit-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="limit-modal-header">
          <h3>Download Limit Reached</h3>
        </div>
        <div className="limit-modal-body">
          <p>
            Your free download limit has been reached. To continue downloading,
            you must <strong>upload at least one note</strong>.
          </p>
        </div>
        <div className="limit-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Later
          </button>
          <button className="btn-primary" onClick={handleUploadClick}>
            Upload a Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimitExceededModal;
