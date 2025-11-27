const express = require('express');
const router = express.Router();
const Order = require('../../models/OrderModel'); // ✅ MongoDB model
const Product = require('../../models/ProductModel'); // ✅ MongoDB model
const adminAuth = require('../../middleware/adminAuth');

// Apply admin authentication to all routes
router.use(adminAuth);

/**
 * GET /api/admin/dashboard - Get dashboard statistics
 */
router.get('/', async (req, res) => {
  try {
    // Get ALL orders from MongoDB
    const allOrders = await Order.find().lean();
    
    // Filter orders by status
    const completedOrders = allOrders.filter(o => o.status === 'completed');
    const confirmedOrders = allOrders.filter(o => o.status === 'confirmed');
    const pendingOrders = allOrders.filter(o => o.status === 'pending');
    
    // Calculate REAL revenue from completed + confirmed orders
    const confirmedAndCompleted = [...completedOrders, ...confirmedOrders];
    const totalRevenue = confirmedAndCompleted.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingRevenue = pendingOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    // Get product statistics from MongoDB
    const allProducts = await Product.find().lean();
    const totalProducts = allProducts.length;
    const outOfStockProducts = allProducts.filter(p => p.stock === 0).length;
    const lowStockProducts = allProducts.filter(p => p.stock > 0 && p.stock < 10).length;
    
    // Get top selling products by purchaseCount (NEW field)
    const topSelling = allProducts
      .sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0))
      .slice(0, 10)
      .map(p => ({
        id: p.productId,
        title: p.title,
        purchaseCount: p.purchaseCount || 0,
        sold: p.sold || 0,
        stock: p.stock,
        price: p.price
      }));
    
    // Get recent orders (last 10)
    const recentOrders = allOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(o => ({
        id: o.orderNumber,
        orderNumber: o.orderNumber,
        customer: o.customer,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt
      }));
    
    // Count orders by status
    const statusCounts = {
      pending: pendingOrders.length,
      confirmed: confirmedOrders.length,
      completed: completedOrders.length,
      cancelled: allOrders.filter(o => o.status === 'cancelled').length,
      processing: allOrders.filter(o => o.status === 'processing').length
    };
    
    const dashboard = {
      overview: {
        totalRevenue,
        pendingRevenue,
        totalOrders: allOrders.length,
        completedOrders: completedOrders.length,
        confirmedOrders: confirmedOrders.length,
        pendingOrders: pendingOrders.length,
        totalProducts,
        totalUsers: 0, // TODO: Implement user count
        activeUsers: 0
      },
      products: {
        total: totalProducts,
        outOfStock: outOfStockProducts,
        lowStock: lowStockProducts,
        topSelling
      },
      orders: {
        total: allOrders.length,
        statusCounts,
        recentOrders
      },
      alerts: {
        lowStock: lowStockProducts,
        pendingOrders: pendingOrders.length,
        outOfStock: outOfStockProducts
      }
    };
    
    res.json({
      success: true,
      data: dashboard,
      admin: req.user.username,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/admin/dashboard/revenue - Get revenue statistics
 */
router.get('/revenue', async (req, res) => {
  try {
    const { period = 'month' } = req.query; // day, week, month, year
    
    // Get completed AND confirmed orders (both count as revenue)
    const confirmedOrders = await Order.find({ 
      status: { $in: ['completed', 'confirmed'] } 
    }).lean();
    
    // Group by period
    const revenueByPeriod = {};
    
    confirmedOrders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      let key;
      
      switch (period) {
        case 'day':
          key = orderDate.toISOString().split('T')[0];
          break;
        case 'week':
          const weekNum = Math.floor((orderDate - new Date(orderDate.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
          key = `${orderDate.getFullYear()}-W${weekNum}`;
          break;
        case 'month':
          key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          key = orderDate.getFullYear().toString();
          break;
        default:
          key = orderDate.toISOString().split('T')[0];
      }
      
      if (!revenueByPeriod[key]) {
        revenueByPeriod[key] = {
          period: key,
          revenue: 0,
          orders: 0
        };
      }
      
      revenueByPeriod[key].revenue += order.total || 0;
      revenueByPeriod[key].orders += 1;
    });
    
    const revenueData = Object.values(revenueByPeriod).sort((a, b) => 
      a.period.localeCompare(b.period)
    );
    
    res.json({
      success: true,
      data: {
        period,
        revenue: revenueData,
        totalRevenue: confirmedOrders.reduce((sum, o) => sum + (o.total || 0), 0),
        totalOrders: confirmedOrders.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/admin/dashboard/analytics - Get detailed analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const allOrders = await Order.find().lean();
    const allProducts = await Product.find().lean();
    
    // Calculate conversion rate (completed + confirmed / total orders)
    const successfulOrders = allOrders.filter(o => 
      o.status === 'completed' || o.status === 'confirmed'
    ).length;
    const conversionRate = allOrders.length > 0 
      ? (successfulOrders / allOrders.length * 100).toFixed(2) 
      : 0;
    
    // Average order value (from completed + confirmed orders)
    const totalRevenue = allOrders
      .filter(o => o.status === 'completed' || o.status === 'confirmed')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue = successfulOrders > 0 
      ? (totalRevenue / successfulOrders).toFixed(0) 
      : 0;
    
    // Most popular categories (by purchaseCount)
    const categoryStats = {};
    allProducts.forEach(p => {
      if (!categoryStats[p.category]) {
        categoryStats[p.category] = {
          category: p.category,
          products: 0,
          totalPurchases: 0,
          totalSold: 0
        };
      }
      categoryStats[p.category].products += 1;
      categoryStats[p.category].totalPurchases += p.purchaseCount || 0;
      categoryStats[p.category].totalSold += p.sold || 0;
    });
    
    const topCategories = Object.values(categoryStats)
      .sort((a, b) => b.totalPurchases - a.totalPurchases)
      .slice(0, 5);
    
    res.json({
      success: true,
      data: {
        conversionRate: parseFloat(conversionRate),
        avgOrderValue: parseFloat(avgOrderValue),
        topCategories,
        totalRevenue,
        totalOrders: allOrders.length,
        successfulOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
