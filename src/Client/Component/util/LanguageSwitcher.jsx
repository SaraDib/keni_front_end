import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLanguage } from 'react-icons/io5'; // Using language icon from react-icons

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [showOptions, setShowOptions] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowOptions(false);
  };

  return (
    <div className="relative">
      <button 
        className="flex items-center justify-center p-2 rounded-full bg-white hover:bg-gray-100 text-blue-900 shadow-md"
        onClick={() => setShowOptions(!showOptions)}
        aria-label="Change language"
      >
        <IoLanguage size={24} />
        <span className="ml-1 text-xs font-bold">{i18n.language.toUpperCase()}</span>
      </button>
      
      {showOptions && (
        <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <button
            className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'fr' ? 'bg-customGreen text-white' : 'hover:bg-gray-100'}`}
            onClick={() => changeLanguage('fr')}
          >
            Français
          </button>
          <button
            className={`block w-full text-left px-4 py-2 text-sm ${i18n.language === 'ar' ? 'bg-customGreen text-white' : 'hover:bg-gray-100'}`}
            onClick={() => changeLanguage('ar')}
          >
            العربية
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;