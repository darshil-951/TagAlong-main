module.exports = (req, res, next) => {
  // First check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Then check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  // If user is admin, proceed
  next();
};