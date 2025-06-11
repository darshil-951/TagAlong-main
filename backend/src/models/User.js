const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const VerificationDocumentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['aadhar', 'license', 'voter_id'],
    required: true
  },
  number: { type: String, required: true },
  verified: { type: Boolean, default: false }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified'],
    default: 'unverified'
  },
  verificationDocuments: [VerificationDocumentSchema],
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  onlineStatus: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline'
  },
  lastSeen: { type: Date }
}, { timestamps: true });

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);