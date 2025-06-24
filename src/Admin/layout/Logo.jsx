import React from 'react';

const Logo = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-10 w-10'
  };

  const textSizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} bg-blue-600 rounded-md flex items-center justify-center`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white"
          style={{ width: '70%', height: '70%' }}
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <span className={`font-bold ${textSizeClasses[size]}`}>Admin</span>
    </div>
  );
};

export default Logo; 