import React, { useState, useEffect } from "react";
import "./InputModal.css";

const InputModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Enter Information",
  message,
  placeholder = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  required = true
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (required && !inputValue.trim()) {
      return;
    }
    onConfirm(inputValue.trim());
    setInputValue("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content input-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {message && <p style={{ marginBottom: "16px" }}>{message}</p>}
          <div className="form-group">
            <textarea
              className="form-textarea"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              rows={4}
            />
            {required && !inputValue.trim() && (
              <div className="form-error">This field is required</div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            {cancelText}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleConfirm}
            disabled={required && !inputValue.trim()}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputModal;

