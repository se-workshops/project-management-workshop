import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/formatters.js';
import Button from '../common/Button.jsx';
import './CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { t } = useTranslation();
  
  const handleQuantityChange = (delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0 && newQuantity <= item.product.stock) {
      onUpdateQuantity(item.productId, newQuantity);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.product.imageUrl} alt={item.product.name} />
      </div>
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.product.name}</h3>
        <p className="cart-item-brand">{item.product.brand}</p>
        <p className="cart-item-price">{formatPrice(item.product.price)}</p>
      </div>
      <div className="cart-item-quantity">
        <button
          className="quantity-btn"
          onClick={() => handleQuantityChange(-1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="quantity-value">{item.quantity}</span>
        <button
          className="quantity-btn"
          onClick={() => handleQuantityChange(1)}
          disabled={item.quantity >= item.product.stock}
        >
          +
        </button>
      </div>
      <div className="cart-item-subtotal">
        <p>{formatPrice(item.subtotal)}</p>
      </div>
      <div className="cart-item-remove">
        <Button
          variant="danger"
          size="sm"
          onClick={() => onRemove(item.productId)}
        >
          {t('cartItem.remove')}
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
