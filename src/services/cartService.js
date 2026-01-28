import apiService from './api.js';

export const getCart = async () => {
  return apiService.get('/cart');
};

export const addToCart = async (productId, quantity = 1) => {
  return apiService.post('/cart/items', { productId, quantity });
};

export const updateCartItem = async (productId, quantity) => {
  return apiService.put(`/cart/items/${productId}`, { quantity });
};

export const removeCartItem = async (productId) => {
  return apiService.delete(`/cart/items/${productId}`);
};

export const clearCart = async () => {
  return apiService.delete('/cart');
};
