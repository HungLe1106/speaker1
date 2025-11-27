const express = require('express');
const router = express.Router();
const Order = require('../models/Order.v2'); // ✅ Changed to MongoDB version
const Product = require('../models/Product.v2'); // ✅ Changed to MongoDB version
const MoMoPayment = require('../services/MoMoPayment');
const crypto = require('crypto');
const qs = require('qs');

// Initialize payment services
const momoPayment = new MoMoPayment();

// Function to sort object keys (for general use)
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
}

// POST /api/webhooks/momo - MoMo payment return/IPN
router.post('/momo', async (req, res) => {
  try {
    console.log('MoMo webhook received:', req.body);
    
    const verification = momoPayment.verifyCallback(req.body);
    
    if (!verification.isValid) {
      console.error('Invalid MoMo signature');
      return res.status(200).json({
        resultCode: 97,
        message: 'Invalid signature'
      });
    }
    
    const order = await Order.getOrderById(verification.orderId); // ✅ Added await
    if (!order) {
      console.error('Order not found:', verification.orderId);
      return res.status(200).json({
        resultCode: 1,
        message: 'Order not found'
      });
    }
    
    if (verification.isSuccess) {
      // Payment successful
      await Order.updateOrderStatus(verification.orderId, 'completed', { // ✅ Added await
        ...order.paymentInfo,
        transactionId: verification.transactionId,
        completedAt: new Date().toISOString(),
        verified: true,
        payType: verification.payType
      });
      
      // Update product stock
      for (const item of order.items) { // ✅ Changed to for...of loop
        await Product.updateStock(item.id, item.qty); // ✅ Added await
      }
      
      console.log('MoMo payment completed for order:', verification.orderId);
    } else {
      // Payment failed
      await Order.updateOrderStatus(verification.orderId, 'failed', { // ✅ Added await
        ...order.paymentInfo,
        failedAt: new Date().toISOString(),
        verified: true,
        resultCode: verification.resultCode,
        message: verification.message
      });
      
      console.log('MoMo payment failed for order:', verification.orderId);
    }
    
    res.status(200).json({
      resultCode: 0,
      message: 'success'
    });
    
  } catch (error) {
    console.error('MoMo webhook error:', error);
    res.status(200).json({
      resultCode: 99,
      message: 'Internal server error'
    });
  }
});

// GET /api/webhooks/momo - MoMo return URL (for redirect)
router.get('/momo', async (req, res) => {
  try {
    console.log('MoMo return URL received:', req.query);
    
    const verification = momoPayment.verifyCallback(req.query);
    
    if (!verification.isValid) {
      console.error('Invalid MoMo signature on return');
      return res.redirect(`${process.env.FRONTEND_URL}/payment/result?status=error&message=Invalid signature`);
    }
    
    const orderId = verification.orderId;
    
    if (verification.isSuccess) {
      console.log('MoMo payment successful for order:', orderId);
      res.redirect(`${process.env.FRONTEND_URL}/payment/result?status=success&orderId=${orderId}`);
    } else {
      console.log('MoMo payment failed for order:', orderId, 'Message:', verification.message);
      res.redirect(`${process.env.FRONTEND_URL}/payment/result?status=failed&orderId=${orderId}&message=${verification.message}`);
    }
    
  } catch (error) {
    console.error('MoMo return URL error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/result?status=error&message=Internal server error`);
  }
});

module.exports = router;