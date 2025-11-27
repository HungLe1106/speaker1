const express = require('express');
const router = express.Router();

// In-memory cart storage (trong thực tế sẽ dùng session hoặc database)
let carts = {};

// GET /api/cart/:sessionId - Get cart contents
router.get('/:sessionId', (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const cart = carts[sessionId] || { items: {}, total: 0 };
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/cart/:sessionId/add - Add item to cart
router.post('/:sessionId/add', (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }
    
    if (!carts[sessionId]) {
      carts[sessionId] = { items: {}, total: 0 };
    }
    
    const cart = carts[sessionId];
    
    if (cart.items[productId]) {
      cart.items[productId].qty += quantity;
    } else {
      // Trong thực tế sẽ lấy thông tin product từ database
      cart.items[productId] = {
        id: productId,
        qty: quantity,
        // Thêm thông tin product khác...
      };
    }
    
    // Recalculate total
    cart.total = Object.values(cart.items).reduce((sum, item) => {
      return sum + (item.price || 0) * item.qty;
    }, 0);
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/cart/:sessionId/update - Update item quantity
router.put('/:sessionId/update', (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const { productId, quantity } = req.body;
    
    if (!carts[sessionId] || !carts[sessionId].items[productId]) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }
    
    const cart = carts[sessionId];
    
    if (quantity <= 0) {
      delete cart.items[productId];
    } else {
      cart.items[productId].qty = quantity;
    }
    
    // Recalculate total
    cart.total = Object.values(cart.items).reduce((sum, item) => {
      return sum + (item.price || 0) * item.qty;
    }, 0);
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/cart/:sessionId/remove/:productId - Remove item from cart
router.delete('/:sessionId/remove/:productId', (req, res) => {
  try {
    const { sessionId, productId } = req.params;
    
    if (!carts[sessionId] || !carts[sessionId].items[productId]) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }
    
    const cart = carts[sessionId];
    delete cart.items[productId];
    
    // Recalculate total
    cart.total = Object.values(cart.items).reduce((sum, item) => {
      return sum + (item.price || 0) * item.qty;
    }, 0);
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/cart/:sessionId/clear - Clear entire cart
router.delete('/:sessionId/clear', (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    carts[sessionId] = { items: {}, total: 0 };
    
    res.json({
      success: true,
      data: carts[sessionId]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;