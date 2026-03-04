const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth failed: No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the complete user from the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Set the complete user object in the request
    // Add userId alias so controllers can use req.user.userId or req.user._id
    req.user = user;
    req.user.userId = user._id;
    next();
  } catch (err) {
    console.log('Auth failed: Invalid token', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};