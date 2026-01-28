import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useTranslation } from 'react-i18next';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import Button from '../components/common/Button.jsx';
import './CartPage.css';

const CartPage = () => {
  const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    if (window.confirm(t('cart.confirmClear'))) {
      await clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <h2>{t('cart.empty.title')}</h2>
          <p>{t('cart.empty.message')}</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            {t('cart.empty.button')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-container">
        <h1>{t('cart.title')}</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div className="cart-summary-container">
            <CartSummary
              items={items}
              totalAmount={totalAmount}
              onCheckout={handleCheckout}
              onClearCart={handleClearCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
