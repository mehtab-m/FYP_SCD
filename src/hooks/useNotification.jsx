import { useState, useCallback } from "react";
import Notification from "../components/Notification/Notification.jsx";

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
  }, []);

  const showSuccess = useCallback(
    (message) => showNotification(message, "success"),
    [showNotification]
  );

  const showError = useCallback(
    (message) => showNotification(message, "error"),
    [showNotification]
  );

  const showWarning = useCallback(
    (message) => showNotification(message, "warning"),
    [showNotification]
  );

  const showInfo = useCallback(
    (message) => showNotification(message, "info"),
    [showNotification]
  );

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const NotificationComponent = notification ? (
    <Notification
      message={notification.message}
      type={notification.type}
      onClose={hideNotification}
    />
  ) : null;

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    NotificationComponent,
  };
};
