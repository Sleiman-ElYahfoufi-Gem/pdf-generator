export const authenticateToken = (req, res, next) => {
  // Check if user is logged in via session
  if (!req.session || !req.session.user) {
    return res.redirect('/api/auth/login');
  }

  // Attach user info to request object
  req.user = req.session.user;
  
  next();
};