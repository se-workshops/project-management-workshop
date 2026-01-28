import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatPrice, formatDate } from '../utils/formatters.js';
import Button from '../components/common/Button.jsx';
import './OrderCompletePage.css';

const OrderCompletePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const order = location.state?.order;

  if (!order) {
    navigate('/');
    return null;
  }

  return (
    <div className="order-complete-page">
      <div className="page-container">
        <div className="completion-card">
          <div className="success-icon">✓</div>
          <h1>{t('orderComplete.title')}</h1>
          <p className="completion-message">
            {t('orderComplete.message')}
          </p>

          <div className="order-info">
            <div className="info-row">
              <span className="label">{t('orderComplete.orderNumber')}:</span>
              <span className="value">{order.orderId}</span>
            </div>
            <div className="info-row">
              <span className="label">{t('orderComplete.orderDate')}:</span>
              <span className="value">{formatDate(order.orderedAt)}</span>
            </div>
            <div className="info-row">
              <span className="label">{t('orderComplete.total')}:</span>
              <span className="value total">{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="info-row">
              <span className="label">{t('orderComplete.status')}:</span>
              <span className="value status">
                {order.status === 'confirmed' ? t('orderComplete.statusConfirmed') : order.status}
              </span>
            </div>
          </div>

          <div className="action-buttons">
            <Button variant="primary" size="lg" onClick={() => navigate('/orders')}>
              {t('orderComplete.viewOrders')}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')}>
              {t('orderComplete.continueShopping')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletePage;
