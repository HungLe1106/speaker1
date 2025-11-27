const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel'); // ✅ Use MongoDB model

// GET /api/products/best-sellers - Get best-selling products
router.get('/best-sellers', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get products sorted by purchaseCount (highest first)
    const bestSellers = await Product.find({ status: 'active' })
      .sort({ purchaseCount: -1, sold: -1 })
      .limit(limit)
      .lean();
    
    // Transform to match frontend format
    const transformedProducts = bestSellers.map(p => ({
      id: p.productId,
      title: p.title,
      desc: p.desc,
      price: p.price,
      stock: p.stock,
      category: p.category,
      img: p.img,
      images: p.images || [],
      discount: p.discount || 0,
      rating: p.rating?.average || 0,
      ratingCount: p.rating?.count || 0,
      sold: p.sold || 0,
      purchaseCount: p.purchaseCount || 0,
      brand: p.brand,
      status: p.status
    }));
    
    res.json({
      success: true,
      data: {
        products: transformedProducts,
        total: transformedProducts.length
      }
    });
  } catch (error) {
    console.error('Best sellers error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/products - Get all products with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    
    const skip = (page - 1) * limit;
    const query = { status: 'active' };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Product.countDocuments(query);
    
    // Transform to frontend format
    const transformedProducts = products.map(p => ({
      id: p.productId,
      title: p.title,
      desc: p.desc,
      price: p.price,
      stock: p.stock,
      category: p.category,
      img: p.img,
      images: p.images || [],
      discount: p.discount || 0,
      rating: p.rating?.average || 0,
      ratingCount: p.rating?.count || 0,
      sold: p.sold || 0,
      purchaseCount: p.purchaseCount || 0,
      brand: p.brand,
      status: p.status
    }));

    res.json({
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id }).lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Transform to frontend format
    const transformedProduct = {
      id: product.productId,
      title: product.title,
      desc: product.desc,
      price: product.price,
      stock: product.stock,
      category: product.category,
      img: product.img,
      images: product.images || [],
      discount: product.discount || 0,
      rating: product.rating?.average || 0,
      ratingCount: product.rating?.count || 0,
      sold: product.sold || 0,
      purchaseCount: product.purchaseCount || 0,
      brand: product.brand,
      status: product.status,
      specifications: product.specifications,
      reviews: product.reviews || []
    };
    
    res.json({
      success: true,
      data: transformedProduct
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/products/check-stock - Check stock availability for multiple items
router.post('/check-stock', async (req, res) => { // ✅ Added async
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Items array is required'
      });
    }
    
    const stockCheck = await Product.checkStock(items); // ✅ Added await
    
    res.json({
      success: true,
      data: stockCheck
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;