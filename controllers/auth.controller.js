import { authenticateUser } from '../services/auth.service.js';
import { COOKIE_MAX_AGE, PAGES_FOLDER } from '../utils/constants.js';
export const login = async (req, res) => {
  try {
    const { clientId, secretKey, email } = req.body;
    const result = await authenticateUser(clientId, secretKey, email);
    
    // Send JWT token to client in HTTP-only cookie
    // Server does NOT store the token - it's stateless
    res.cookie('token', result.token, {
      httpOnly: true, // Can't be accessed by JavaScript (security)
      maxAge: COOKIE_MAX_AGE, // 24 hours
      sameSite: 'strict'
    });
    
    // Redirect to PDF form after successful login
    res.redirect('/api/pdf/pdf-form');

/* WHEN FRONTEND IN USE */
   // res.json({ token: result.token }); // Send JSON, let frontend handle redirect

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const showLoginForm = (req, res) => {
  res.render(`${PAGES_FOLDER}/login`);
};

export const logout = (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('token');
  res.redirect('/api/auth/login');
};