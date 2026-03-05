const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createSystemNotification } = require('../utils/notificationHelper');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send welcome notification
    try {
      await createSystemNotification(
        user._id,
        'Welcome to TagAlong! 🎉',
        `Hi ${name}, welcome aboard! Start by listing a trip or searching for carriers to send your parcels.`,
        '/search'
      );
    } catch (notifErr) {
      console.error('Failed to send welcome notification:', notifErr);
    }

    // Remove password from user object before sending
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ message: 'User registered successfully', user: userObj, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user and return JWT
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Remove password from user object before sending
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token, user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};