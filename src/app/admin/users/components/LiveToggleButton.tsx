'use client';

import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface LiveToggleButtonProps {
  isActive: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const LiveToggleButton: React.FC<LiveToggleButtonProps> = ({ 
  isActive, 
  onToggle, 
  size = 'lg',
  disabled = false
}) => {
  const sizeClasses = {
    sm: 'w-10 h-5',
    md: 'w-12 h-6', 
    lg: 'w-16 h-8'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <button
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        relative rounded-full transition-all duration-300 ease-in-out
        ${disabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : isActive 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-red-500 hover:bg-red-600'
        }
        ${disabled ? '' : 'shadow-lg hover:shadow-xl transform hover:scale-105'}
        focus:outline-none focus:ring-4 focus:ring-opacity-50
        ${disabled 
          ? 'focus:ring-gray-300' 
          : isActive 
            ? 'focus:ring-green-300' 
            : 'focus:ring-red-300'
        }
        flex items-center justify-center
      `}
      title={disabled ? 'Admin accounts cannot be deactivated' : (isActive ? 'Click to deactivate' : 'Click to activate')}
    >
      {/* Background circle that moves */}
      <div 
        className={`
          absolute top-1 bottom-1 rounded-full bg-white shadow-md
          transition-all duration-300 ease-in-out
          ${isActive ? 'left-1' : 'right-1'}
          ${size === 'sm' ? 'w-4' : size === 'md' ? 'w-6' : 'w-8'}
        `}
      />
      
      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center">
        {isActive ? (
          <ToggleRight 
            size={iconSizes[size]} 
            className="text-white drop-shadow-sm" 
          />
        ) : (
          <ToggleLeft 
            size={iconSizes[size]} 
            className="text-white drop-shadow-sm" 
          />
        )}
      </div>
      
      {/* Status text */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <span className={`
          text-xs font-semibold px-2 py-1 rounded-full
          ${disabled
            ? 'bg-gray-100 text-gray-600'
            : isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }
        `}>
          {disabled ? 'Locked' : (isActive ? 'Active' : 'Inactive')}
        </span>
      </div>
    </button>
  );
};

export default LiveToggleButton;
