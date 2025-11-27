const { v4: uuidv4 } = require('uuid');

// In-memory storage (trong thực tế sẽ dùng database)
let orders = [];

module.exports = {
  // Create new order
  createOrder: (orderData) => {
    const order = {
      id: `ORD_${Date.now()}_${uuidv4().substr(0, 8)}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.unshift(order); // Add to beginning for newest first
    return order;
  },

  // Get order by ID
  getOrderById: (id) => {
    return orders.find(o => o.id === id);
  },

  // Update order status
  updateOrderStatus: (id, status, paymentInfo = null) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      
      if (paymentInfo) {
        order.paymentInfo = paymentInfo;
      }
      
      return order;
    }
    return null;
  },

  // Get orders with filtering
  getOrders: (filters = {}) => {
    let filtered = [...orders];
    
    if (filters.status) {
      filtered = filtered.filter(o => o.status === filters.status);
    }
    
    if (filters.customerId) {
      filtered = filtered.filter(o => o.customer?.id === filters.customerId);
    }
    
    return filtered;
  },

  // Get order statistics
  getOrderStats: () => {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
    
    return {
      totalOrders: orders.length,
      statusCounts,
      totalRevenue
    };
  }
};