import React from 'react';
import { NapType, NAP_TYPE_INFO } from '../app/types';

interface BigButtonProps {
  type: NapType;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const BigButton: React.FC<BigButtonProps> = ({
  type,
  onClick,
  disabled = false,
  className = '',
}) => {
  const info = NAP_TYPE_INFO[type];
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        btn-primary w-full h-24 md:h-28 text-xl md:text-2xl font-bold
        flex flex-col items-center justify-center gap-1
        transform transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <span className="text-lg md:text-xl">{info.name}</span>
      <span className="text-sm md:text-base opacity-80 font-normal">
        {info.description}
      </span>
    </button>
  );
};
