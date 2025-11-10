// src/components/common/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-4xl mb-3">⚠️</div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;