const jwt = require('jsonwebtoken');
const UserStore = require('../models/UserStore.v2');

/**
 * Admin Authentication Middleware
 * Verifies JWT token and checks if user has admin role
 * Must be used after regular auth middleware
 */
const adminAuth = async (req, res, next) => {
  try {
    // Check if user is authenticated first
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Please login first.'
      });
    }
    
    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    
    // Get user from database (JWT payload uses 'id' not 'userId')
    const user = await UserStore.getUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'User account is not active'
      });
    }
    
    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.',
        userRole: user.role
      });
    }
    
    // Add user to request object for use in route handlers
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    next();
    
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during authentication'
    });
  }
};

module.exports = adminAuth;
