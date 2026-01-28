import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as productService from '../../services/productService.js';
import './ProductFilter.css';

const ProductFilter = ({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
}) => {
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="product-filter">
      <div className="filter-section">
        <h3>{t('productFilter.category')}</h3>
        <div className="category-list">
          <button
            className={`category-item ${!selectedCategory ? 'active' : ''}`}
            onClick={() => onCategoryChange(null)}
          >
            {t('productFilter.all')}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-item ${
                selectedCategory === category.id ? 'active' : ''
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>{t('productFilter.search')}</h3>
        <input
          type="text"
          className="search-input"
          placeholder={t('productFilter.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-section">
        <h3>{t('productFilter.sort')}</h3>
        <select
          className="sort-select"
          value={`${sortOption.field}-${sortOption.order}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            onSortChange({ field, order });
          }}
        >
          <option value="name-asc">{t('productFilter.sortOptions.nameAsc')}</option>
          <option value="name-desc">{t('productFilter.sortOptions.nameDesc')}</option>
          <option value="price-asc">{t('productFilter.sortOptions.priceAsc')}</option>
          <option value="price-desc">{t('productFilter.sortOptions.priceDesc')}</option>
          <option value="rating-desc">{t('productFilter.sortOptions.ratingDesc')}</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilter;
