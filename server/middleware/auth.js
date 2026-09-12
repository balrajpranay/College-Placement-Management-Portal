const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction && !process.env.JWT_SECRET) {
  console.error('[Security Error] FATAL: JWT_SECRET environment variable is required in production.');
  process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET || 'campus_connect_jwt_secret_dev_key';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (mongoose.connection.readyState === 1) {
      req.user = await User.findById(decoded.id).select('-passwordHash');
    }
    
    if (!req.user) {
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        isActive: true
      };
    }

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or has been deactivated.'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid or expired token.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required.'
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this endpoint.`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
