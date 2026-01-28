import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getOrders } from '../services/orderService.js';
import { formatPrice, formatDate } from '../utils/formatters.js';
import Loading from '../components/common/Loading.jsx';
import Button from '../components/common/Button.jsx';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        if (response.success) {
          setOrders(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return <Loading message={t('orderHistory.loading')} />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{t('orderHistory.error', { message: error })}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div className="empty-orders-content">
          <h2>{t('orderHistory.empty.title')}</h2>
          <p>{t('orderHistory.empty.message')}</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            {t('orderHistory.empty.button')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="page-container">
        <h1>{t('orderHistory.title')}</h1>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <span className="label">{t('orderHistory.orderNumber')}:</span>
                  <span className="value">{order.id}</span>
                </div>
                <div className="order-date">{formatDate(order.orderedAt)}</div>
              </div>

              <div className="order-body">
                <div className="order-info-row">
                  <span className="label">{t('orderHistory.itemCount')}:</span>
                  <span>{t('orderHistory.items', { count: order.itemCount })}</span>
                </div>
                <div className="order-info-row">
                  <span className="label">{t('orderHistory.total')}:</span>
                  <span className="price">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="order-info-row">
                  <span className="label">{t('orderHistory.status')}:</span>
                  <span className={`status status-${order.status}`}>
                    {order.status === 'confirmed' ? t('orderHistory.statusConfirmed') : order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
