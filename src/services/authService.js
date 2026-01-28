import apiService from './api.js';

export const login = async (email, password) => {
  const response = await apiService.post('/auth/login', { email, password });
  if (response.success && response.sessionId) {
    apiService.setToken(response.sessionId);
  }
  return response;
};

export const logout = async () => {
  const response = await apiService.post('/auth/logout');
  apiService.setToken(null);
  return response;
};

export const getCurrentUser = async () => {
  return apiService.get('/auth/me');
};
