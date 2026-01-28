import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${i18n.resolvedLanguage === 'ja' ? 'active' : ''}`}
        onClick={() => changeLanguage('ja')}
      >
        日本語
      </button>
      <button
        className={`lang-btn ${i18n.resolvedLanguage === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;
