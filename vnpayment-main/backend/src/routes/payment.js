const express = require('express');
const router = express.Router();
const Order = require('../models/Order.v2'); // ✅ Changed to MongoDB version
const MoMoPayment = require('../services/MoMoPayment');

// Initialize payment services
const momoPayment = new MoMoPayment();

// POST /api/payment/create - Create payment URL
router.post('/create', async (req, res) => {
  try {
    const { orderId, paymentMethod, orderInfo } = req.body;
    
    if (!orderId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Order ID and payment method are required'
      });
    }
    
    // Get order details
    const order = await Order.getOrderById(orderId); // ✅ Added await
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Get client IP address properly
    const ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
        '127.0.0.1';
    
    // Prepare payment info based on method
    let paymentInfo = {
      orderId,
      amount: order.total,
      orderInfo: orderInfo || `Thanh toán đơn hàng ${orderId}`,
      ipAddress: ipAddr
    };
    
    if (paymentMethod.toLowerCase() === 'momo') {
      // Use the direct notifyUrl for MoMo
      paymentInfo.notifyUrl = `${req.protocol}://${req.get('host')}/api/webhooks/momo`;
      paymentInfo.redirectUrl = `${req.protocol}://${req.get('host')}/api/webhooks/momo`;
    }
    
    let result;
    
    switch (paymentMethod.toLowerCase()) {
      case 'momo':
        result = await momoPayment.createPayment(paymentInfo);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Unsupported payment method'
        });
    }
    
    if (result.success) {
      // Update order with payment info
      await Order.updateOrderStatus(orderId, 'processing', { // ✅ Added await
        method: paymentMethod,
        createdAt: new Date().toISOString()
      });
    }
    
    res.json({
      success: result.success,
      data: {
        payUrl: result.payUrl,
        paymentMethod,
        orderId,
        amount: order.total
      }
    });
    
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/payment/methods - Get available payment methods
router.get('/methods', (req, res) => {
  try {
    const methods = [
      {
        id: 'momo',
        name: 'MoMo',
        description: 'Thanh toán qua ví điện tử MoMo',
        icon: '💰',
        enabled: !!(process.env.MOMO_PARTNER_CODE && process.env.MOMO_ACCESS_KEY && process.env.MOMO_SECRET_KEY)
      }
    ];
    
    res.json({
      success: true,
      data: methods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/payment/status/:orderId - Check payment status
router.get('/status/:orderId', async (req, res) => { // ✅ Added async
  try {
    const order = await Order.getOrderById(req.params.orderId); // ✅ Added await
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        paymentInfo: order.paymentInfo,
        total: order.total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/payment/test-momo - Test MoMo payment creation
router.post('/test-momo', async (req, res) => {
  try {
    const { amount = 50000, orderId, orderInfo = 'Test payment with MoMo' } = req.body;
    
    // Generate random order ID if not provided
    const testOrderId = orderId || 'MOMO' + Date.now();
    
    // Prepare payment info
    const paymentInfo = {
      orderId: testOrderId,
      amount: amount,
      orderInfo: orderInfo,
      redirectUrl: `${req.protocol}://${req.get('host')}/api/webhooks/momo`,
      ipnUrl: `${req.protocol}://${req.get('host')}/api/webhooks/momo_ipn`
    };

    console.log('=== MOMO TEST API CALL ===');
    console.log('Payment Info:', paymentInfo);
    console.log('==========================');

    const result = await momoPayment.createPayment(paymentInfo);

    res.json({
      success: result.success,
      data: {
        payUrl: result.payUrl,
        paymentMethod: 'momo',
        orderId: testOrderId,
        amount: amount,
        orderInfo: orderInfo,
        library: 'custom-momo',
        debugInfo: {
          requestId: result.data.requestId,
          signature: result.data.signature,
          deeplink: result.data.deeplink,
          qrCodeUrl: result.data.qrCodeUrl,
          redirectUrl: paymentInfo.redirectUrl,
          ipnUrl: paymentInfo.ipnUrl
        }
      }
    });

  } catch (error) {
    console.error('MoMo test payment creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// GET /api/payment/test-connection - Test MoMo API connection
router.get('/test-connection', async (req, res) => {
  try {
    console.log('=== Testing MoMo API Connection ===');
    
    // Test with a simple small amount payment
    const testPaymentInfo = {
      orderId: 'TEST_CONN_' + Date.now(),
      amount: 10000, // 10,000 VND
      orderInfo: 'Test kết nối MoMo API',
      redirectUrl: `${req.protocol}://${req.get('host')}/api/webhooks/momo`,
      ipnUrl: `${req.protocol}://${req.get('host')}/api/webhooks/momo_ipn`
    };

    const result = await momoPayment.createPayment(testPaymentInfo);

    res.json({
      success: true,
      message: 'MoMo API connection successful',
      data: {
        orderId: testPaymentInfo.orderId,
        payUrl: result.payUrl,
        responseTime: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('MoMo connection test failed:', error.message);
    res.status(500).json({
      success: false,
      error: 'MoMo API connection failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/payment/config - Get payment configuration (for debugging)
router.get('/config', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        momo: {
          partnerCode: process.env.MOMO_PARTNER_CODE || 'MISSING',
          accessKey: process.env.MOMO_ACCESS_KEY ? process.env.MOMO_ACCESS_KEY.substring(0, 6) + '***' : 'MISSING',
          secretKey: process.env.MOMO_SECRET_KEY ? '***' + process.env.MOMO_SECRET_KEY.substring(-4) : 'MISSING',
          endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
          enabled: !!(process.env.MOMO_PARTNER_CODE && process.env.MOMO_ACCESS_KEY && process.env.MOMO_SECRET_KEY)
        },
        server: {
          host: req.get('host'),
          protocol: req.protocol,
          ip: req.ip,
          userAgent: req.get('user-agent'),
          frontendUrl: process.env.FRONTEND_URL || 'MISSING'
        }
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