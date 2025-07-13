import React, { useState, useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const AlertSuccess = ({ message, onClose, autoClose = true, autoCloseTime = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          if (onClose) onClose();
        }, 300); // Wait for fade out animation
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Wait for fade out animation
  };

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mt-4 rounded-lg shadow-lg flex items-center max-w-md">
        <FiCheckCircle className="text-green-500 text-xl mr-3" />
        <div className="flex-grow">{message}</div>
        <button 
          onClick={handleClose}
          className="text-green-500 hover:text-green-700 ml-3 focus:outline-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default AlertSuccess;