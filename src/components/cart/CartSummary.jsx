import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/formatters.js';
import Button from '../common/Button.jsx';
import './CartSummary.css';

const CartSummary = ({ items, totalAmount, onCheckout, onClearCart }) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const { t } = useTranslation();

  return (
    <div className="cart-summary">
      <h2 className="cart-summary-title">{t('cartSummary.title')}</h2>
      
      <div className="summary-row">
        <span>{t('cartSummary.itemCount')}:</span>
        <span>{t('cartSummary.items', { count: itemCount })}</span>
      </div>
      
      <div className="summary-row">
        <span>{t('cartSummary.subtotal')}:</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>
      
      <div className="summary-row total">
        <span>{t('cartSummary.total')}:</span>
        <span className="total-amount">{formatPrice(totalAmount)}</span>
      </div>
      
      <div className="summary-actions">
        <Button
          variant="primary"
          size="lg"
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          {t('cartSummary.checkout')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearCart}
          disabled={items.length === 0}
        >
          {t('cartSummary.clearCart')}
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
