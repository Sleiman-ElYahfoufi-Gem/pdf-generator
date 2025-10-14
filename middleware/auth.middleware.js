import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository.js';

export const authenticateToken = async (req, res, next) => {
  try {
    // Get JWT token from cookie (sent by client browser automatically)
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/api/auth/login');
    }

    // Verify JWT token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database using the userId from JWT
    const user = await userRepository.findById(decoded.userId);
    
    if (!user) {
      return res.redirect('/api/auth/login');
    }

    // Attach user info to request object
    req.user = {
      id: user.id,
      clientId: user.client_id,
      email: user.email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.redirect('/api/auth/login');
    }
    if (error.name === 'JsonWebTokenError') {
      return res.redirect('/api/auth/login');
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};