import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`
        card bg-dark-card rounded-2xl p-6 shadow-lg border border-dark-border
        backdrop-blur-sm bg-opacity-80
        ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow duration-200' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
