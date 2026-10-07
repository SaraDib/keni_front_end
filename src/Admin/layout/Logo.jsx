import React from 'react';
import logo from '../assets/globalhealth-logo.png';

// Logo Global Health du back-office. `compact` affiche seulement le monogramme.
const Logo = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white ${className}`}>
        GH
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img src={logo} alt="Global Health" className="h-auto w-40" />
    </div>
  );
};

export default Logo;
