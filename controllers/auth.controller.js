import { authenticateUser } from '../services/auth.service.js';

export const login = async (req, res) => {
  try {
    const { clientId, secretKey, email } = req.body;
    const result = await authenticateUser(clientId, secretKey, email);
    
    // Store user in session
    req.session.user = result.user;
    req.session.token = result.token;
    
    // Redirect to PDF form after successful login
    res.redirect('/api/pdf/pdf-form');
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const showLoginForm = (req, res) => {
  res.render("pages/login");
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.redirect('/api/auth/login');
  });
};