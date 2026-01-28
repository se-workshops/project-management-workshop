import apiService from './api.js';

export const getOrders = async () => {
  return apiService.get('/orders');
};

export const getOrderById = async (id) => {
  return apiService.get(`/orders/${id}`);
};

export const createOrder = async (shippingAddress) => {
  return apiService.post('/orders', { shippingAddress });
};
