import React from 'react';
import { useTranslation } from 'react-i18next';
import './Loading.css';

const Loading = ({ message }) => {
  const { t } = useTranslation();
  const displayMessage = message || t('loading.default');
  
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{displayMessage}</p>
    </div>
  );
};

export default Loading;
