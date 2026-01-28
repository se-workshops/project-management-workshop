import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProductById } from '../services/productService.js';
import { useCart } from '../hooks/useCart.js';
import { formatPrice } from '../utils/formatters.js';
import Button from '../components/common/Button.jsx';
import Loading from '../components/common/Loading.jsx';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response.success) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const result = await addItem(product.id, quantity);
    if (result.success) {
      alert(t('productDetail.addedToCart', { name: product.name, quantity }));
    } else {
      alert(result.error || t('productDetail.addToCartError'));
    }
  };

  if (isLoading) {
    return <Loading message={t('productDetail.loading')} />;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>{t('productDetail.notFound')}</h2>
        <Button onClick={() => navigate('/')}>{t('productDetail.backToList')}</Button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="page-container">
        <button className="back-button" onClick={() => navigate('/')}>
          ← {t('productDetail.backToList')}
        </button>

        <div className="product-detail">
          <div className="product-image-large">
            <img src={product.imageUrl} alt={product.name} />
          </div>

          <div className="product-info-detail">
            <div className="product-brand">{product.brand}</div>
            <h1 className="product-name">{product.name}</h1>

            <div className="product-rating">
              {'⭐'.repeat(Math.floor(product.rating))} {product.rating} ({t('productDetail.reviews', { count: product.reviewCount })})
            </div>

            <div className="product-price">{formatPrice(product.price)}</div>

            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">{t('productDetail.inStock', { count: product.stock })}</span>
              ) : (
                <span className="out-of-stock">{t('productDetail.outOfStock')}</span>
              )}
            </div>

            <div className="product-description">
              <h2>{t('productDetail.description')}</h2>
              <p>{product.description}</p>
            </div>

            <div className="product-specifications">
              <h2>{t('productDetail.specifications')}</h2>
              <table>
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <th>{key}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="purchase-section">
              <div className="quantity-selector">
                <label>{t('productDetail.quantity')}:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {t('productDetail.addToCart')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
