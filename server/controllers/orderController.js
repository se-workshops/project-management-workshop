import dataStore from '../store/dataStore.js';

export const getOrders = (req, res) => {
  try {
    const orders = dataStore.getOrdersByUserId(req.userId);
    
    // Return summary of orders
    const orderSummaries = orders.map(order => ({
      id: order.id,
      totalAmount: order.totalAmount,
      status: order.status,
      itemCount: order.items.length,
      orderedAt: order.orderedAt
    }));
    
    res.json({
      success: true,
      data: orderSummaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
};

export const getOrderById = (req, res) => {
  try {
    const order = dataStore.getOrderById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: '注文が見つかりません'
      });
    }
    
    // Check if order belongs to user
    if (order.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'この注文にアクセスする権限がありません'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
};

export const createOrder = (req, res) => {
  try {
    const { shippingAddress } = req.body;
    
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        error: '配送先住所を指定してください'
      });
    }
    
    const cart = dataStore.getCart(req.userId);
    
    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'カートが空です'
      });
    }
    
    // Build order items and check stock
    const orderItems = [];
    let totalAmount = 0;
    
    for (const cartItem of cart.items) {
      const product = dataStore.getProductById(cartItem.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `商品が見つかりません: ${cartItem.productId}`
        });
      }
      
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          error: `在庫が不足しています: ${product.name}`,
          details: {
            productId: product.id,
            requested: cartItem.quantity,
            available: product.stock
          }
        });
      }
      
      const subtotal = product.price * cartItem.quantity;
      
      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: cartItem.quantity,
        unitPrice: product.price,
        subtotal
      });
      
      totalAmount += subtotal;
      
      // Decrease stock
      dataStore.updateProductStock(product.id, product.stock - cartItem.quantity);
    }
    
    // Create order
    const order = dataStore.createOrder(req.userId, {
      items: orderItems,
      totalAmount,
      status: 'confirmed',
      shippingAddress
    });
    
    // Clear cart
    dataStore.clearCart(req.userId);
    
    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        orderedAt: order.orderedAt
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
};
