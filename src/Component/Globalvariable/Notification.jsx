// components/Notification.js
import React, { useEffect, useState } from 'react';

const Notification = ({ message, type, onClose }) => {
  const typeStyles = {
    success: "bg-green-100 border-green-500 text-green-800",
    error: "bg-red-100 border-red-500 text-red-800",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
    info: "bg-blue-100 border-blue-500 text-blue-800",
  };

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true); // trigger animation on mount

    // Auto close after 3s (optional)
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300); // wait for slide-out before removing
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        fixed top-5 right-5 z-50 max-w-sm w-full 
        border-l-4 p-4 rounded shadow-lg transition-transform duration-300 ease-in-out
        ${typeStyles[type]}
        ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-lg font-semibold">{message}</span>
        <button
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 300);
          }}
          className="text-2xl font-bold leading-none focus:outline-none cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;
