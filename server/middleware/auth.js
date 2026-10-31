const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { isAuthorizedAdminEmail } = require('../config/adminAllowlist');

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
    
    if (mongoose.connection.readyState === 1 && decoded.id) {
      try {
        req.user = await User.findById(decoded.id).select('-passwordHash');
      } catch (e) {}
    }
    
    if (!req.user) {
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role || 'student',
        isActive: true
      };
    } else {
      if (!req.user.role) {
        req.user.role = decoded.role || 'student';
      }
      if (!req.user.name && decoded.name) {
        req.user.name = decoded.name;
      }
    }

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or has been deactivated.'
      });
    }

    // STALE SESSION & REVOKED ADMIN TOKEN PROTECTION:
    // If the token or DB account holds 'admin' role, verify email against the authorized allowlist.
    // If authorization was revoked or the email is unauthorized, reject the request outright.
    if (req.user.role === 'admin' && !isAuthorizedAdminEmail(req.user.email)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrator privileges are unauthorized for this account.'
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
    // STRICT ADMIN SECURITY ENFORCEMENT:
    // Any endpoint requiring 'admin' role MUST verify that the authenticated user's email
    // is in the authorized 3-email allowlist.
    if (roles.includes('admin') || req.user.role === 'admin') {
      if (!isAuthorizedAdminEmail(req.user.email)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Email '${req.user.email || 'unknown'}' is not authorized as a Placement Administrator.`
        });
      }
    }

    const userRole = req.user.role || 'student';
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `User role '${userRole}' is not authorized to access this endpoint.`
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
  isAuthorizedAdminEmail
};
