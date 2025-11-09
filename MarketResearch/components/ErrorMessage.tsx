import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  icon,
  className = '',
}) => {
  const defaultIcon = (
    <svg
      className="error-message__icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );

  return (
    <div 
      className={`error-message ${className}`} 
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="error-message__content">
        <div className="error-message__icon-wrapper" aria-hidden="true">
          {icon || defaultIcon}
        </div>
        <p className="error-message__text" id="error-message-text">{message}</p>
      </div>
      {onRetry && (
        <button
          className="error-message__retry-button"
          onClick={onRetry}
          type="button"
          aria-label="Retry generating market research"
          aria-describedby="error-message-text"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
