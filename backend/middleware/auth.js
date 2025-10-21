const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const { findMockUserById } = require('../utils/mockData');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Check if it's a mock token (for when database is not connected)
      if (token.startsWith('mock-jwt-token-')) {
        console.log('Using mock token authentication');
        // Extract user ID from mock token format: mock-jwt-token-{objectId}-{timestamp}
        const tokenParts = token.split('-');
        if (tokenParts.length >= 4) {
          const userObjectId = tokenParts[3];
          // Ensure we have a valid ObjectId format
          if (mongoose.Types.ObjectId.isValid(userObjectId)) {
            req.user = { id: userObjectId };
            next();
            return;
          } else {
            // Fallback: create a new ObjectId for mock data
            const newObjectId = new mongoose.Types.ObjectId();
            req.user = { id: newObjectId.toString() };
            next();
            return;
          }
        }
      }

      // Verify real JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

      // Check if MongoDB is connected
      if (mongoose.connection.readyState !== 1) {
        console.log('Database not connected, using mock data for auth');
        req.user = { id: decoded.id };
        next();
        return;
      }

      // Get user from database
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed' 
      });
    }
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token' 
    });
  }
};

module.exports = { protect };
