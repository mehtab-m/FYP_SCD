import React, { useEffect } from "react";
import "./Notification.css";

const Notification = ({
  message,
  type = "info",
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={`notification notification-${type}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="notification-icon">{icons[type]}</span>
      <span className="notification-message">{message}</span>

      {onClose && (
        <button
          className="notification-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Notification;
