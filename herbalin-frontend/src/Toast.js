import React, { useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";

export function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: { bg: "bg-green-900 text-white",        Icon: FaCheckCircle },
    error:   { bg: "bg-red-600 text-white",           Icon: FaTimesCircle },
    info:    { bg: "bg-gray-800 text-white",          Icon: FaInfoCircle },
    warning: { bg: "bg-yellow-500 text-white",        Icon: FaExclamationTriangle },
  };

  const { bg, Icon } = styles[type] || styles.info;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium ${bg}`}
      style={{ minWidth: 260, maxWidth: 380 }}
    >
      <Icon size={18} className="flex-shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 flex-shrink-0">
        <FaTimes size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = React.useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });
  const hideToast = () => setToast(null);

  const ToastComponent = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={hideToast} />
  ) : null;

  return { showToast, ToastComponent };
}