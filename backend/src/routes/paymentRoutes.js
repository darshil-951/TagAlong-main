const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

// Create payment intent (requires authentication)
router.post('/create-payment-intent', auth, paymentController.createPaymentIntent);

// Confirm payment (requires authentication)
router.post('/confirm-payment', auth, paymentController.confirmPayment);

// Get payment status (requires authentication)
router.get('/status/:parcelId', auth, paymentController.getPaymentStatus);

module.exports = router;