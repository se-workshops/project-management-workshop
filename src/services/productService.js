import apiService from './api.js';

export const getProducts = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.category) queryParams.append('category', params.category);
  if (params.search) queryParams.append('search', params.search);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.order) queryParams.append('order', params.order);
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/products?${queryString}` : '/products';
  
  return apiService.get(endpoint);
};

export const getProductById = async (id) => {
  return apiService.get(`/products/${id}`);
};

export const getCategories = async () => {
  return apiService.get('/categories');
};
