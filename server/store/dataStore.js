import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dummy data
const loadJSON = (filename) => {
  const filePath = path.join(__dirname, '../data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Initialize data store
class DataStore {
  constructor() {
    this.users = loadJSON('users.json');
    this.products = loadJSON('products.json');
    this.categories = loadJSON('categories.json');
    this.sessions = new Map(); // sessionId -> userId
    this.carts = {}; // userId -> cart
    this.orders = []; // array of orders
    this.orderIdCounter = 1;
  }

  // Reset to initial state
  reset() {
    this.users = loadJSON('users.json');
    this.products = loadJSON('products.json');
    this.categories = loadJSON('categories.json');
    this.sessions.clear();
    this.carts = {};
    this.orders = [];
    this.orderIdCounter = 1;
  }

  // User methods
  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findUserById(userId) {
    return this.users.find(user => user.id === userId);
  }

  // Session methods
  createSession(userId) {
    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.sessions.set(sessionId, userId);
    return sessionId;
  }

  getUserIdBySession(sessionId) {
    return this.sessions.get(sessionId);
  }

  deleteSession(sessionId) {
    this.sessions.delete(sessionId);
  }

  // Product methods
  getAllProducts() {
    return this.products;
  }

  getProductById(productId) {
    return this.products.find(p => p.id === productId);
  }

  updateProductStock(productId, newStock) {
    const product = this.getProductById(productId);
    if (product) {
      product.stock = newStock;
    }
  }

  // Category methods
  getAllCategories() {
    return this.categories;
  }

  // Cart methods
  getCart(userId) {
    if (!this.carts[userId]) {
      this.carts[userId] = {
        userId,
        items: [],
        updatedAt: new Date().toISOString()
      };
    }
    return this.carts[userId];
  }

  addToCart(userId, productId, quantity) {
    const cart = this.getCart(userId);
    const existingItem = cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  updateCartItemQuantity(userId, productId, quantity) {
    const cart = this.getCart(userId);
    const item = cart.items.find(item => item.productId === productId);
    
    if (item) {
      item.quantity = quantity;
      cart.updatedAt = new Date().toISOString();
    }
    
    return cart;
  }

  removeFromCart(userId, productId) {
    const cart = this.getCart(userId);
    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  clearCart(userId) {
    this.carts[userId] = {
      userId,
      items: [],
      updatedAt: new Date().toISOString()
    };
    return this.carts[userId];
  }

  // Order methods
  createOrder(userId, orderData) {
    const orderId = `ord-${String(this.orderIdCounter).padStart(3, '0')}`;
    this.orderIdCounter++;

    const order = {
      id: orderId,
      userId,
      ...orderData,
      orderedAt: new Date().toISOString()
    };

    this.orders.push(order);
    return order;
  }

  getOrdersByUserId(userId) {
    return this.orders.filter(order => order.userId === userId);
  }

  getOrderById(orderId) {
    return this.orders.find(order => order.id === orderId);
  }
}

// Create singleton instance
const dataStore = new DataStore();

export default dataStore;
