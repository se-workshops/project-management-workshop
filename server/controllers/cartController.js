import dataStore from '../store/dataStore.js';

export const getCart = (req, res) => {
  try {
    const cart = dataStore.getCart(req.userId);
    
    // Enrich cart items with product details
    const enrichedItems = cart.items.map(item => {
      const product = dataStore.getProductById(item.productId);
      return {
        productId: item.productId,
        product: product ? {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          brand: product.brand
        } : null,
        quantity: item.quantity,
        subtotal: product ? product.price * item.quantity : 0
      };
    }).filter(item => item.product !== null);
    
    const totalAmount = enrichedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = enrichedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      success: true,
      data: {
        items: enrichedItems,
        totalAmount,
        itemCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    // Simulate slow response (20 seconds delay)
    await new Promise(resolve => setTimeout(resolve, 20000));
    
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: '商品IDと数量を正しく指定してください'
      });
    }
    
    const product = dataStore.getProductById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: '商品が見つかりません'
      });
    }
    
    // Check stock
    const cart = dataStore.getCart(req.userId);
    const existingItem = cart.items.find(item => item.productId === productId);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantity + quantity;
    
    if (newTotalQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        error: '在庫が不足しています',
        details: {
          requested: newTotalQuantity,
          available: product.stock
        }
      });
    }
    
    dataStore.addToCart(req.userId, productId, quantity);
    
    // Return updated cart
    return getCart(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
};

export const updateCartItem = (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        error: '数量は0以上を指定してください'
      });
    }
    
    const product = dataStore.getProductById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: '商品が見つかりません'
      });
    }
    
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        error: '在庫が不足しています',
        details: {
          requested: quantity,
          available: product.stock
        }
      });
    }
    
    if (quantity === 0) {
      dataStore.removeFromCart(req.userId, productId);
    } else {
      dataStore.updateCartItemQuantity(req.userId, productId, quantity);
    }
    
    // Return updated cart
    return getCart(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
};

export const removeCartItem = (req, res) => {
  try {
    const { productId } = req.params;
    
    dataStore.removeFromCart(req.userId, productId);
    
    res.json({
      success: true,
      message: 'カートから削除しました'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
};

export const clearCart = (req, res) => {
  try {
    dataStore.clearCart(req.userId);
    
    res.json({
      success: true,
      message: 'カートをクリアしました'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
};
