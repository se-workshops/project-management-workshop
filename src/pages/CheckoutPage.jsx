import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import { useTranslation } from 'react-i18next';
import { createOrder } from '../services/orderService.js';
import { formatPrice } from '../utils/formatters.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { items, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    postalCode: user?.address?.postalCode || '',
    prefecture: user?.address?.prefecture || '',
    city: user?.address?.city || '',
    street: user?.address?.street || '',
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await createOrder(shippingAddress);
      if (response.success) {
        navigate('/order-complete', { state: { order: response.data } });
      } else {
        setError(response.error || t('checkout.orderError'));
      }
    } catch (err) {
      setError(err.message || t('checkout.orderError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="page-container">
        <h1>{t('checkout.title')}</h1>

        <div className="checkout-layout">
          <div className="checkout-form">
            <h2>{t('checkout.shippingInfo')}</h2>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmitOrder}>
              <Input
                label={t('checkout.postalCode')}
                value={shippingAddress.postalCode}
                onChange={(value) => handleInputChange('postalCode', value)}
                placeholder={t('checkout.postalCodePlaceholder')}
                required
              />

              <Input
                label={t('checkout.prefecture')}
                value={shippingAddress.prefecture}
                onChange={(value) => handleInputChange('prefecture', value)}
                placeholder={t('checkout.prefecturePlaceholder')}
                required
              />

              <Input
                label={t('checkout.city')}
                value={shippingAddress.city}
                onChange={(value) => handleInputChange('city', value)}
                placeholder={t('checkout.cityPlaceholder')}
                required
              />

              <Input
                label={t('checkout.street')}
                value={shippingAddress.street}
                onChange={(value) => handleInputChange('street', value)}
                placeholder={t('checkout.streetPlaceholder')}
                required
              />

              <div className="form-actions">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/cart')}
                  disabled={isLoading}
                >
                  {t('checkout.backToCart')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {t('checkout.confirmOrder')}
                </Button>
              </div>
            </form>
          </div>

          <div className="order-summary">
            <h2>{t('checkout.orderSummary')}</h2>

            <div className="order-items">
              {items.map((item) => (
                <div key={item.productId} className="order-item">
                  <div className="order-item-info">
                    <div className="order-item-name">{item.product.name}</div>
                    <div className="order-item-quantity">
                      {t('checkout.quantity', { count: item.quantity })}
                    </div>
                  </div>
                  <div className="order-item-price">
                    {formatPrice(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span>{t('checkout.subtotal')}:</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="total-row final">
                <span>{t('checkout.total')}:</span>
                <span className="total-amount">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
