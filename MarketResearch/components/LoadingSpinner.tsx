import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  ariaLabel?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  ariaLabel = 'Loading'
}) => {
  return (
    <div 
      className={`loading-spinner loading-spinner--${size}`}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <div className="loading-spinner__circle" aria-hidden="true"></div>
      <span className="visually-hidden">{ariaLabel}</span>
    </div>
  );
};

export default LoadingSpinner;
