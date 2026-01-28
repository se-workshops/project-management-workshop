import React, { createContext, useState, useEffect, useContext } from 'react';
import * as cartService from '../services/cartService.js';
import { AuthContext } from './AuthContext.jsx';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart when not authenticated
      setItems([]);
      setTotalAmount(0);
      setItemCount(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await cartService.getCart();
      if (response.success) {
        setItems(response.data.items);
        setTotalAmount(response.data.totalAmount);
        setItemCount(response.data.itemCount);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    setError(null);
    try {
      const response = await cartService.addToCart(productId, quantity);
      if (response.success) {
        setItems(response.data.items);
        setTotalAmount(response.data.totalAmount);
        setItemCount(response.data.itemCount);
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setError(null);
    try {
      const response = await cartService.updateCartItem(productId, quantity);
      if (response.success) {
        setItems(response.data.items);
        setTotalAmount(response.data.totalAmount);
        setItemCount(response.data.itemCount);
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const removeItem = async (productId) => {
    setError(null);
    try {
      await cartService.removeCartItem(productId);
      await fetchCart();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const clearCart = async () => {
    setError(null);
    try {
      await cartService.clearCart();
      setItems([]);
      setTotalAmount(0);
      setItemCount(0);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    items,
    totalAmount,
    itemCount,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
