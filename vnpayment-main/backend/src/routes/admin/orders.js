const express = require('express');
const router = express.Router();
const Order = require('../../models/OrderModel'); // ✅ Use MongoDB model
const Product = require('../../models/ProductModel'); // ✅ Use MongoDB model
const adminAuth = require('../../middleware/adminAuth');

// Apply admin authentication to all routes
router.use(adminAuth);

/**
 * GET /api/admin/orders - Get all orders with filtering
 */
router.get('/', async (req, res) => {
  try {
    const filters = {};
    
    if (req.query.status) filters.status = req.query.status;
    if (req.query.paymentMethod) filters.paymentMethod = req.query.paymentMethod;
    
    // Date range filtering
    if (req.query.startDate || req.query.endDate) {
      filters.createdAt = {};
      if (req.query.startDate) {
        filters.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filters.createdAt.$lte = new Date(req.query.endDate);
      }
    }
    
    const orders = await Order.find(filters)
      .sort({ createdAt: -1 })
      .lean();
    
    // Transform to match frontend format
    const transformedOrders = orders.map(o => ({
      id: o.orderNumber,
      orderNumber: o.orderNumber,
      customer: o.customer,
      items: o.items,
      total: o.total,
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt
    }));
    
    res.json({
      success: true,
      data: {
        orders: transformedOrders
      },
      count: transformedOrders.length,
      admin: req.user.username
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/admin/orders/:id - Get order by ID with full details
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.id }).lean();
    
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

/**
 * PUT /api/admin/orders/:id/status - Update order status
 */
router.put('/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const paymentInfo = {
      updatedBy: req.user.username,
      updatedAt: new Date().toISOString(),
      note: note || ''
    };
    
    const order = await Order.updateOrderStatus(req.params.id, status, paymentInfo);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    console.log(`Admin ${req.user.username} updated order ${req.params.id} status to ${status}`);
    
    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/orders/:id/confirm - Confirm order (change to confirmed)
 */
router.put('/:id/confirm', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { note } = req.body;
    
    const order = await Order.findOne({ orderNumber: orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Cannot confirm order with status: ${order.status}`
      });
    }
    
    // ✅ INCREMENT purchaseCount for each product in order
    for (const item of order.items) {
      const product = await Product.findOne({ productId: item.productCode });
      if (product) {
        // Increment purchaseCount by quantity ordered
        await Product.findByIdAndUpdate(
          product._id,
          { 
            $inc: { 
              purchaseCount: item.qty,
              sold: item.qty  // Also update sold count
            } 
          }
        );
        console.log(`✅ Incremented purchaseCount for ${item.productCode} by ${item.qty}`);
      }
    }
    
    // Update order status to confirmed
    order.status = 'confirmed';
    order.paymentInfo = {
      ...order.paymentInfo,
      confirmedBy: req.user.username,
      confirmedAt: new Date().toISOString(),
      note: note || 'Order confirmed by admin'
    };
    order.statusHistory.push({
      status: 'confirmed',
      updatedAt: new Date(),
      note: note || 'Order confirmed by admin',
      updatedBy: req.user.username
    });
    
    await order.save();
    
    console.log(`Admin ${req.user.username} confirmed order ${orderId}`);
    
    res.json({
      success: true,
      data: order,
      message: 'Order confirmed successfully'
    });
  } catch (error) {
    console.error('Confirm order error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/orders/:id/complete - Complete order
 */
router.put('/:id/complete', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { note } = req.body;
    
    const order = await Order.findOne({ orderNumber: orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    if (order.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Order is already completed'
      });
    }
    
    // ✅ If order wasn't confirmed before, increment purchaseCount now
    if (order.status === 'pending') {
      for (const item of order.items) {
        const product = await Product.findOne({ productId: item.productCode });
        if (product) {
          await Product.findByIdAndUpdate(
            product._id,
            { 
              $inc: { 
                purchaseCount: item.qty,
                sold: item.qty
              } 
            }
          );
          console.log(`✅ Incremented purchaseCount for ${item.productCode} by ${item.qty}`);
        }
      }
    }
    
    // Update order status to completed
    order.status = 'completed';
    order.paymentStatus = 'paid';
    order.paymentInfo = {
      ...order.paymentInfo,
      completedBy: req.user.username,
      completedAt: new Date().toISOString(),
      note: note || 'Order completed by admin'
    };
    order.statusHistory.push({
      status: 'completed',
      updatedAt: new Date(),
      note: note || 'Order completed by admin',
      updatedBy: req.user.username
    });
    
    await order.save();
    
    console.log(`Admin ${req.user.username} completed order ${orderId}`);
    
    res.json({
      success: true,
      data: order,
      message: 'Order completed successfully'
    });
  } catch (error) {
    console.error('Complete order error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/orders/:id - Cancel order
 */
router.delete('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { reason } = req.body;
    
    // ✅ Use Mongoose findOne instead of getOrderById
    const order = await Order.findOne({ orderNumber: orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    if (order.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel completed order'
      });
    }
    
    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Order is already cancelled'
      });
    }
    
    // ✅ Update order directly with Mongoose
    order.status = 'cancelled';
    // ✅ Set paymentStatus based on current status
    // If already paid, mark as refunded. Otherwise, mark as failed
    order.paymentStatus = order.paymentStatus === 'paid' ? 'refunded' : 'failed';
    order.paymentInfo = {
      ...order.paymentInfo,
      cancelledBy: req.user.username,
      cancelledAt: new Date().toISOString(),
      reason: reason || 'Cancelled by admin'
    };
    order.statusHistory.push({
      status: 'cancelled',
      updatedAt: new Date(),
      note: reason || 'Cancelled by admin',
      updatedBy: req.user.username
    });
    
    await order.save();
    
    console.log(`Admin ${req.user.username} cancelled order ${orderId}`);
    
    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/admin/orders/stats/summary - Get order statistics
 */
router.get('/stats/summary', async (req, res) => {
  try {
    // ✅ Calculate stats using Mongoose aggregation
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    const stats = {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/admin/orders/pending/count - Get pending orders count
 */
router.get('/pending/count', async (req, res) => {
  try {
    // ✅ Use Mongoose find instead of getOrders
    const orders = await Order.find({ status: 'pending' })
      .select('orderNumber customer total createdAt')
      .lean();
    
    res.json({
      success: true,
      data: {
        count: orders.length,
        orders: orders.map(o => ({
          id: o.orderNumber,
          customer: o.customer,
          total: o.total,
          createdAt: o.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get pending orders error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
