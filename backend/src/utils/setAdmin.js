const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const setUserAsAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }
    
    // Update user role to admin
    user.role = 'admin';
    await user.save();
    
    console.log(`User ${user.name} (${user.email}) has been set as admin`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address');
  console.log('Usage: node setAdmin.js user@example.com');
  process.exit(1);
}

setUserAsAdmin(email);