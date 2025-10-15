import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository.js';
import logger from '../utils/logger.js';

export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      logger.warn('Authentication failed: No token provided', {
        url: req.url,
        method: req.method
      });
      return res.status(401).json({ 
        success: false,
        message: 'Access token is required' 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await userRepository.findById(decoded.userId);
    
    if (!user) {
      logger.warn('Authentication failed: Invalid user', {
        userId: decoded.userId,
        url: req.url
      });
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }

    // Attach user info to request object
    req.user = {
      id: user.id,
      clientId: user.client_id,
      email: user.email
    };

    logger.debug('User authenticated', {
      userId: user.id,
      url: req.url
    });

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Authentication failed: Token expired', {
        url: req.url
      });
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired' 
      });
    }
    if (error.name === 'JsonWebTokenError') {
      logger.warn('Authentication failed: Invalid token', {
        url: req.url,
        error: error.message
      });
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    
    logger.error('Authentication error', {
      error: error.message,
      stack: error.stack,
      url: req.url
    });
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};