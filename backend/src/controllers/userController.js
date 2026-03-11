const User = require('../models/User');
const { bufferToDataUri } = require('../utils/cloudUpload');

// Example feature flag
const isFeatureEnabled = process.env.FEATURE_FLAG_UPDATE_EMAIL === 'true';

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Clear old local avatar URLs that no longer resolve after cloud migration
    if (user.avatar && user.avatar.includes('/uploads/')) {
      user.avatar = null;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Convert to base64 data URI (stored directly in MongoDB, no external service needed)
    const avatarUrl = bufferToDataUri(req.file.buffer, req.file.mimetype);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id || req.user.id || req.user.userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ avatarUrl, user: updatedUser });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
};

// Update user email
exports.updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, { email }, { new: true }).select('-password');
    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update email' });
  }
};

// Update user phone
exports.updatePhone = async (req, res) => {
  try {
    const { phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, { phone }, { new: true }).select('-password');
    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update phone' });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Both old and new passwords are required' });
    }
    // Use correct user ID property
    const user = await User.findById(req.user.userId).select('+password');
    if (!user || !(await user.comparePassword(oldPassword))) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }
    // Hash the new password before saving
    const bcrypt = require('bcryptjs');
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password' });
  }
};
// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    // Use the same userId property as in other methods
    const user = await User.findById(req.user.userId).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

// Set user as admin (protected by adminAuth middleware)
exports.setUserAsAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.role = 'admin';
    await user.save();
    
    res.json({ message: 'User has been set as admin', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to set user as admin' });
  }
};
