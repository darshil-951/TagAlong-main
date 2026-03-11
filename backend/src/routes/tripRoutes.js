const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authenticate = require('../middlewares/auth');
const multer = require('multer');
// Use memory storage to completely remove local directory dependencies and enable cloud deployments
const upload = multer({ storage: multer.memoryStorage() });

// OCR Aadhaar
router.post('/ocr/aadhaar', upload.single('aadhaar'), tripController.aadhaarOcr);

// OTP endpoints
router.post('/otp/send', tripController.sendOtp);
router.post('/otp/verify', tripController.verifyOtp);

// Trip creation (protected)
router.post('/trips', authenticate, tripController.createTrip);
router.put('/trips/:id', authenticate, tripController.editTrip);

// Get trips for logged-in user
router.get('/mytrips', authenticate, tripController.getMyTrips);

// Get all trips (public, for search)
router.get('/trips', tripController.getAllTrips);
router.get('/alltrips', tripController.getAllTrips);

// Edit a trip
// Add this DELETE route
router.delete('/trips/:id', authenticate, tripController.deleteTrip);

module.exports = router;