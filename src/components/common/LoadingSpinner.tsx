// src/components/common/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className={`${sizeClasses[size]} border-4 border-border-color border-t-brand-color rounded-full animate-spin`} />
      {message && (
        <p className="mt-4 text-light-text text-sm">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;