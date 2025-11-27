const Order = require('./OrderModel');
const Product = require('./ProductModel');

/**
 * Create new order
 */
async function createOrder(orderData) {
  try {
    // Generate order number
    const orderNumber = await Order.generateOrderNumber();

    // Prepare order items
    const orderItems = [];
    for (const item of orderData.items) {
      const product = await Product.findOne({ productId: item.id });
      if (product) {
        orderItems.push({
          productId: product._id,
          productCode: item.id,
          title: item.title || product.title,
          price: item.price || product.price,
          qty: item.qty,
          subtotal: item.subtotal || (item.price * item.qty),
          image: product.img
        });
      }
    }

    // Create order
    const order = new Order({
      orderNumber,
      userId: orderData.userId || null,
      customer: orderData.customer,
      items: orderItems,
      subtotal: orderData.total || orderData.subtotal || 0,
      shippingFee: orderData.shippingFee || 0,
      tax: orderData.tax || 0,
      discount: orderData.discount || 0,
      total: orderData.total,
      status: orderData.status || 'pending',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'pending',
      shippingAddress: orderData.shippingAddress,
      notes: orderData.notes
    });

    // Calculate totals if not provided
    if (!orderData.total) {
      order.calculateTotals();
    }

    await order.save();

    return {
      id: order.orderNumber,
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: order.items,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  } catch (error) {
    console.error('createOrder error:', error);
    throw error;
  }
}

/**
 * Get order by ID (order number)
 */
async function getOrderById(id) {
  try {
    const order = await Order.findOne({ orderNumber: id })
      .populate('userId', 'username email')
      .populate('items.productId', 'productId title img');

    if (!order) {
      return null;
    }

    return {
      id: order.orderNumber,
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: order.items.map(item => ({
        id: item.productCode,
        title: item.title,
        price: item.price,
        qty: item.qty,
        subtotal: item.subtotal,
        image: item.image
      })),
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentInfo: order.paymentInfo,
      shippingAddress: order.shippingAddress,
      notes: order.notes,
      trackingNumber: order.trackingNumber,
      statusHistory: order.statusHistory,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  } catch (error) {
    console.error('getOrderById error:', error);
    return null;
  }
}

/**
 * Update order status
 */
async function updateOrderStatus(id, status, paymentInfo = null) {
  try {
    const order = await Order.findOne({ orderNumber: id });
    if (!order) {
      return null;
    }

    order.status = status;
    
    if (paymentInfo) {
      order.paymentInfo = {
        ...order.paymentInfo,
        ...paymentInfo
      };
      
      // Update payment status based on order status
      if (status === 'completed' || status === 'processing') {
        order.paymentStatus = 'paid';
      } else if (status === 'cancelled') {
        order.paymentStatus = 'failed';
      } else if (status === 'refunded') {
        order.paymentStatus = 'refunded';
      }
    }

    await order.save();

    return {
      id: order.orderNumber,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentInfo: order.paymentInfo,
      updatedAt: order.updatedAt
    };
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    return null;
  }
}

/**
 * Get orders with filtering
 */
async function getOrders(filters = {}) {
  try {
    const query = {};

    // Filter by status
    if (filters.status) {
      query.status = filters.status;
    }

    // Filter by customer ID (old format) or user ID
    if (filters.customerId) {
      query.$or = [
        { 'customer.id': filters.customerId },
        { userId: filters.customerId }
      ];
    }

    // Filter by payment status
    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }

    // Date range
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    const orders = await Order.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(filters.limit || 100);

    return orders.map(order => ({
      id: order.orderNumber,
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: order.items,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));
  } catch (error) {
    console.error('getOrders error:', error);
    return [];
  }
}

/**
 * Get order statistics
 */
async function getOrderStats() {
  try {
    const totalOrders = await Order.countDocuments();
    
    // Count by status
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCountsObj = {};
    statusCounts.forEach(item => {
      statusCountsObj[item._id] = item.count;
    });

    // Calculate total revenue (completed orders only)
    const revenueResult = await Order.aggregate([
      {
        $match: { status: 'completed', paymentStatus: 'paid' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customer.name total status createdAt');

    // Orders by payment method
    const paymentMethods = await Order.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      totalOrders,
      statusCounts: statusCountsObj,
      totalRevenue,
      recentOrders: recentOrders.map(o => ({
        orderNumber: o.orderNumber,
        customerName: o.customer.name,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt
      })),
      paymentMethods: paymentMethods.reduce((acc, pm) => {
        acc[pm._id] = pm.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('getOrderStats error:', error);
    return null;
  }
}

/**
 * Cancel order
 */
async function cancelOrder(id, reason) {
  try {
    const order = await Order.findOne({ orderNumber: id });
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'completed' || order.status === 'shipping') {
      throw new Error('Cannot cancel order in current status');
    }

    order.status = 'cancelled';
    order.notes = order.notes ? `${order.notes}\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`;
    
    await order.save();

    return {
      id: order.orderNumber,
      status: order.status
    };
  } catch (error) {
    console.error('cancelOrder error:', error);
    throw error;
  }
}

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getOrders,
  getOrderStats,
  cancelOrder
};
