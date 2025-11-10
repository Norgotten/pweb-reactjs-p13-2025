// src/components/common/EmptyState.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionText?: string;
  actionLink?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = '📦', 
  title, 
  message, 
  actionText, 
  actionLink 
}) => {
  return (
    <div className="bg-white border border-border-color rounded-lg p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-dark-text mb-2">{title}</h3>
      <p className="text-light-text mb-6">{message}</p>
      {actionText && actionLink && (
        <Link 
          to={actionLink}
          className="inline-block bg-brand-color text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;