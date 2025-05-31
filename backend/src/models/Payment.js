const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  parcel: { type: mongoose.Schema.Types.ObjectId, ref: 'ParcelRequest', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
  stripePaymentIntentId: { type: String },
  stripeClientSecret: { type: String },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);