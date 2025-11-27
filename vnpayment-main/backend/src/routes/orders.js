const express = require('express');
const router = express.Router();
const Order = require('../models/Order.v2'); // ✅ Changed to MongoDB version
const Product = require('../models/Product.v2'); // ✅ Changed to MongoDB version

// POST /api/orders - Create new order
router.post('/', async (req, res) => { // Already async ✅
  try {
    const { customer, items, paymentMethod, shippingAddress } = req.body;
    
    // Validate required fields
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Customer info and items are required'
      });
    }
    
    // Check stock availability
    const stockCheck = await Product.checkStock(items); // ✅ Added await
    if (!stockCheck.available) {
      return res.status(400).json({
        success: false,
        error: stockCheck.message
      });
    }
    
    // Calculate total
    let total = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.getProductById(item.id); // ✅ Added await
      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Product ${item.id} not found`
        });
      }
      
      const itemTotal = product.price * item.qty;
      total += itemTotal;
      
      orderItems.push({
        id: product.id,
        title: product.title,
        price: product.price,
        qty: item.qty,
        subtotal: itemTotal
      });
    }
    
    // Create order
    const orderData = {
      customer,
      items: orderItems,
      total,
      paymentMethod,
      shippingAddress,
      status: 'pending'
    };
    
    const order = await Order.createOrder(orderData); // ✅ Added await
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => { // ✅ Added async
  try {
    const order = await Order.getOrderById(req.params.id); // ✅ Added await
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/orders - Get all orders with filtering
router.get('/', async (req, res) => { // ✅ Added async
  try {
    const filters = {
      status: req.query.status,
      customerId: req.query.customerId
    };
    
    const orders = await Order.getOrders(filters); // ✅ Added await
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', async (req, res) => { // ✅ Added async
  try {
    const { status, paymentInfo } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }
    
    const order = await Order.updateOrderStatus(req.params.id, status, paymentInfo); // ✅ Added await
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/orders/stats/summary - Get order statistics
router.get('/stats/summary', async (req, res) => { // ✅ Added async
  try {
    const stats = await Order.getOrderStats(); // ✅ Added await
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;