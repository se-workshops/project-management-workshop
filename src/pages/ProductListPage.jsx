import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts.js';
import { useCart } from '../hooks/useCart.js';
import { useTranslation } from 'react-i18next';
import ProductList from '../components/product/ProductList.jsx';
import ProductFilter from '../components/product/ProductFilter.jsx';
import Loading from '../components/common/Loading.jsx';
import './ProductListPage.css';

const ProductListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState({ field: 'name', order: 'asc' });
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  const { products, pagination, isLoading } = useProducts({
    category: selectedCategory,
    search: searchQuery,
    sort: sortOption.field,
    order: sortOption.order,
    page,
    limit: 12,
  });

  const { addItem } = useCart();

  const handleAddToCart = async (productId) => {
    const result = await addItem(productId, 1);
    if (result.success) {
      alert(t('productList.addedToCart'));
    } else {
      alert(result.error || t('productList.addToCartError'));
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="product-list-page">
      <div className="page-container">
        <aside className="filter-sidebar">
          <ProductFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
        </aside>

        <main className="products-main">
          <div className="products-header">
            <h1>{t('productList.title')}</h1>
            {pagination && (
              <p className="results-count">
                {t('productList.resultsCount', { count: pagination.totalItems })}
              </p>
            )}
          </div>

          {isLoading ? (
            <Loading message={t('productList.loading')} />
          ) : (
            <>
              <ProductList products={products} onAddToCart={handleAddToCart} />

              {pagination && pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    {t('productList.pagination.previous')}
                  </button>
                  <span className="pagination-info">
                    {page} / {pagination.totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pagination.totalPages}
                  >
                    {t('productList.pagination.next')}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;
