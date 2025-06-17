// src/hooks/useNotification.js

import { useState } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (type, title, message, autoClose = true) => {
    setNotification({
      type,
      title,
      message,
      autoClose,
      isOpen: true
    });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  // Métodos específicos para cada tipo
  const showSuccess = (title, message, autoClose = true) => {
    showNotification('success', title, message, autoClose);
  };

  const showError = (title, message, autoClose = false) => {
    showNotification('error', title, message, autoClose);
  };

  const showWarning = (title, message, autoClose = true) => {
    showNotification('warning', title, message, autoClose);
  };

  const showInfo = (title, message, autoClose = true) => {
    showNotification('info', title, message, autoClose);
  };

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useNotification;
