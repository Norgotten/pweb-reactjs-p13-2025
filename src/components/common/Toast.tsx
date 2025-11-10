// src/components/common/Toast.tsx
import React, { useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className={`${typeStyles[type]} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in`}>
      <span className="text-xl">{icons[type]}</span>
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={onClose} className="text-xl opacity-70 hover:opacity-100 transition-opacity">
        ✕
      </button>
    </div>
  );
};

