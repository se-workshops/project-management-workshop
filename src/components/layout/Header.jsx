import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useCart } from '../../hooks/useCart.js';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button.jsx';
import LanguageSwitcher from '../common/LanguageSwitcher.jsx';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>{t('header.title')}</h1>
        </Link>

        {isAuthenticated && (
          <nav className="nav">
            <Link to="/" className="nav-link">
              {t('header.nav.products')}
            </Link>
            <Link to="/orders" className="nav-link">
              {t('header.nav.orders')}
            </Link>
          </nav>
        )}

        <div className="header-actions">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="cart-link">
                <span className="cart-icon">🛒</span>
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
              <span className="user-name">
                {i18n.resolvedLanguage === 'en' 
                  ? t('header.user.greeting', { firstName: user?.firstName, lastName: user?.lastName })
                  : t('header.user.greeting', { lastName: user?.lastName, firstName: user?.firstName })}
              </span>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                {t('header.user.logout')}
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm">
                {t('header.user.login')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
