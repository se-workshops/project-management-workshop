import { useState, useEffect } from 'react';
import * as productService from '../services/productService.js';

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(params);
      if (response.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    params.category,
    params.search,
    params.sort,
    params.order,
    params.page,
    params.limit,
  ]);

  return {
    products,
    pagination,
    isLoading,
    error,
    refetch: fetchProducts,
  };
};
