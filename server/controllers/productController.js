import dataStore from '../store/dataStore.js';

export const getProducts = (req, res) => {
  try {
    let products = dataStore.getAllProducts();
    
    // Filter by category
    if (req.query.category) {
      products = products.filter(p => p.categoryId === req.query.category);
    }
    
    // Search by keyword
    if (req.query.search) {
      const keyword = req.query.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.brand.toLowerCase().includes(keyword)
      );
    }
    
    // Sort products
    const sortField = req.query.sort || 'name';
    const sortOrder = req.query.order || 'asc';
    
    products.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name, 'ja');
      } else if (sortField === 'rating') {
        comparison = a.rating - b.rating;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(products.length / limit),
          totalItems: products.length,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
};

export const getProductById = (req, res) => {
  try {
    const product = dataStore.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: '商品が見つかりません'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
};

export const getCategories = (req, res) => {
  try {
    const categories = dataStore.getAllCategories();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました'
    });
  }
};
