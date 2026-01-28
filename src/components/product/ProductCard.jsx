import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/formatters.js';
import Button from '../common/Button.jsx';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const { t } = useTranslation();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    onAddToCart(product.id);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          {'⭐'.repeat(Math.floor(product.rating))} {product.rating}
        </div>
        <div className="product-price">{formatPrice(product.price)}</div>
        <div className="product-stock">
          {product.stock > 0 ? (
            <span className="in-stock">{t('productCard.inStock', { count: product.stock })}</span>
          ) : (
            <span className="out-of-stock">{t('productCard.outOfStock')}</span>
          )}
        </div>
      </div>
      <div className="product-actions">
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {t('productCard.addToCart')}
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;
