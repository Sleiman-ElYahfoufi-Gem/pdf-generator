import { authenticateUser } from '../services/auth.service.js';
import { PAGES_FOLDER } from '../utils/constants.js';

export const login = async (req, res) => {
  try {
    const { clientId, secretKey, email } = req.body;
    const result = await authenticateUser(clientId, secretKey, email);
    
    // Return token as JSON (no cookie!)
    res.json({
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const showLoginForm = (req, res) => {
  res.render(`${PAGES_FOLDER}/login`);
};

export const logout = (req, res) => {
  res.json({ 
    success: true,
    message: 'Logged out successfully. Please remove token from client.' 
  });
};