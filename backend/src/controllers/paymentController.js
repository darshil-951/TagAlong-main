// Make sure dotenv is loaded before initializing Stripe
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Stripe with the key from environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('WARNING: STRIPE_SECRET_KEY is not set. Payment features will not work.');
}
const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;
const Payment = require('../models/Payment');
const ParcelRequest = require('../models/ParcelRequest');
const Trip = require('../models/Trip');

// Create a payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { parcelId } = req.body;
    console.log('Payment request received for parcelId:', parcelId);
    console.log('User ID from token:', req.user._id);

    // Find the parcel request
    const parcel = await ParcelRequest.findById(parcelId)
      .populate('trip')
      .populate('carrier');

    if (!parcel) {
      console.log('Parcel not found:', parcelId);
      return res.status(404).json({ message: 'Parcel not found' });
    }

    console.log('Parcel sender:', parcel.sender);
    console.log('User ID:', req.user._id);

    // Check if user is the sender
    if (parcel.sender.toString() !== req.user._id.toString()) {
      console.log('Authorization failed: User is not the sender');
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if parcel is accepted
    if (parcel.status !== 'accepted') {
      return res.status(400).json({ message: 'Parcel must be accepted before payment' });
    }

    // Check if Stripe is configured
    if (!stripe) {
      return res.status(503).json({ message: 'Payment service is not configured. Please contact support.' });
    }

    // Use exact amount based on trip price
    const amount = parcel.trip.price;

    // Create a payment intent with Stripe (INR currency, amount in paise)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe requires amount in smallest currency unit (paise for INR)
      currency: 'inr',
      metadata: {
        parcelId: parcel._id.toString(),
        senderId: req.user._id.toString(),
        carrierId: parcel.carrier._id.toString()
      }
    });

    // Create a payment record in our database
    const payment = new Payment({
      parcel: parcel._id,
      amount,
      stripePaymentIntentId: paymentIntent.id,
      stripeClientSecret: paymentIntent.client_secret,
      payer: req.user._id,
      payee: parcel.carrier._id
    });

    await payment.save();

    // Update parcel payment status
    parcel.paymentStatus = 'processing';
    parcel.price = amount;
    await parcel.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Confirm payment success (replaces webhook)
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!stripe) {
      return res.status(503).json({ message: 'Payment service is not configured.' });
    }

    // Verify the payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Update payment status in our database
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId
    }).populate('payer').populate('parcel');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user is the payer
    if (payment.payer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    payment.status = 'succeeded';
    payment.updatedAt = Date.now();
    await payment.save();

    // Update parcel payment status
    const parcel = await ParcelRequest.findById(payment.parcel)
      .populate('sender');

    if (parcel) {
      parcel.paymentStatus = 'paid';
      await parcel.save();

      // Create notification for the carrier
      const notificationHelper = require('../utils/notificationHelper');
      await notificationHelper.createStatusUpdateNotification(
        payment.payee,
        'Payment Received',
        `${payment.payer.name} has made a payment of ₹${payment.amount} for parcel delivery.`,
        `/myparcel`,
        {
          parcelId: payment.parcel._id,
          amount: payment.amount,
          payerName: payment.payer.name,
          payerEmail: payment.payer.email,
          paymentDate: payment.updatedAt,
          paymentId: payment._id
        }
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { parcelId } = req.params;

    const payment = await Payment.findOne({ parcel: parcelId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      status: payment.status,
      amount: payment.amount,
      createdAt: payment.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};