const Trip = require('../models/Trip');
const path = require('path');
const fs = require('fs');
const tesseract = require('tesseract.js'); // npm install tesseract.js
const crypto = require('crypto');

// In-memory OTP store (for demo; use Redis or DB for production)
const otpStore = {};

// Aadhaar OCR endpoint
exports.aadhaarOcr = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Use tesseract.js for OCR
    const result = await tesseract.recognize(req.file.path, 'eng');
    const text = result.data.text;
    console.log('OCR TEXT:', text); // <-- Add this

    // Aadhaar number: 12 digits, not starting with 0 or 1
    const aadhaarMatch = text.match(/\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b/);
    let aadhaarNumber = aadhaarMatch ? aadhaarMatch[0].replace(/\s/g, '') : '';

    // Phone number: 10 digits, starting with 6-9
    const phoneMatch = text.match(/\b[6-9]{1}[0-9]{9}\b/);
    let phone = phoneMatch ? phoneMatch[0] : '';

    // Name extraction: look for "Name" or use the line above "DOB"
    let name = '';
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      if (/^name[:\s]/i.test(lines[i])) {
        name = lines[i].replace(/^name[:\s]*/i, '');
        break;
      }
      if (/^dob[:\s]/i.test(lines[i]) && i > 0) {
        name = lines[i - 1];
        break;
      }
    }

    // Clean up uploaded file
    fs.unlink(req.file.path, () => { });

    if (!aadhaarNumber) {
      return res.json({ error: 'Could not extract Aadhaar number. Please upload a clear image or PDF.' });
    }

    res.json({ name, aadhaarNumber, phone });
  } catch (err) {
    res.status(500).json({ error: 'OCR failed' });
  }
};

exports.sendOtp = async (req, res) => {
  // Firebase handles OTP sending on the frontend
  res.status(501).json({ error: 'OTP sending is now handled by Firebase on the frontend.' });
};

exports.verifyOtp = async (req, res) => {
  // Firebase handles OTP verification on the frontend
  res.status(501).json({ error: 'OTP verification is now handled by Firebase on the frontend.' });
};

// Create (list) a new trip (unchanged)
exports.createTrip = async (req, res) => {
  try {
    const {
      source,
      destination,
      departureDate,
      arrivalDate,
      transport,
      vehicle,
      capacityWeight,
      capacityVolume,
      acceptsFragile,
      duration,
      acceptedCategories,
      price,
      identificationPhoto,
      description,
      images
    } = req.body;

    const trip = new Trip({
      user: req.user.userId,
      source,
      destination,
      departureDate,
      arrivalDate,
      transport,
      vehicle,
      capacityWeight,
      capacityVolume,
      acceptsFragile,
      acceptedCategories,
      price,
      identificationPhoto,
      description,
      images
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all trips for the logged-in user
exports.getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json({ trips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllTrips = async (req, res) => {
  try {
    // Only return trips whose departure date is today or in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const trips = await Trip.find({
      departureDate: { $gte: today }
    }).sort({ departureDate: 1 }).populate('user', 'name avatar rating');
    res.json({ trips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Edit a trip (only by owner)
exports.editTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const updateData = req.body;
    const trip = await Trip.findOneAndUpdate(
      { _id: tripId, user: req.user.userId },
      updateData,
      { new: true }
    );
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not authorized' });
    }
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = await Trip.findOneAndDelete({ _id: tripId, user: req.user.userId });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not authorized' });
    }
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};