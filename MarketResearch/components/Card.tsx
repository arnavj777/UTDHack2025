import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  role?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  ariaLabel,
  role = 'region'
}) => {
  return (
    <div 
      className={`card ${className}`}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

export default Card;
