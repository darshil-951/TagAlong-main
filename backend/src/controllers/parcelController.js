const ParcelRequest = require('../models/ParcelRequest');
const Trip = require('../models/Trip');
const { createParcelRequestNotification, createStatusUpdateNotification } = require('../utils/notificationHelper');

// Get all parcel requests for the current user
exports.getMyParcels = async (req, res) => {
  try {
    const parcels = await ParcelRequest.find({
      $or: [
        { sender: req.user._id },
        { carrier: req.user._id }
      ]
    })
      .populate('trip')
      .populate('carrier')
      .populate('sender');

    res.json(parcels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new parcel request
exports.createParcelRequest = async (req, res) => {
  try {
    const { description, weight, category, trip } = req.body;
    const tripDetails = await Trip.findById(trip).populate('user');
    if (!tripDetails) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    const carrier = tripDetails.user;

    const newRequest = new ParcelRequest({
      description,
      weight,
      category,
      trip,
      carrier,
      sender: req.user._id,
      status: 'pending'
    });

    const savedRequest = await newRequest.save();
    const populatedRequest = await savedRequest.populate('trip carrier');

    // Send notification to carrier
    try {
      await createParcelRequestNotification(
        carrier._id,
        req.user.name || 'Someone',
        { weight: weight || 0 },
        savedRequest._id.toString()
      );
    } catch (notifErr) {
      console.error('Failed to send notification:', notifErr);
    }

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update parcel request status
exports.updateParcelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const parcelRequest = await ParcelRequest.findById(id).populate('sender carrier');
    if (!parcelRequest) {
      return res.status(404).json({ message: 'Parcel request not found' });
    }

    // Update status
    parcelRequest.status = status;
    await parcelRequest.save();

    // Notify the sender about status change
    try {
      const carrierName = parcelRequest.carrier?.name || 'The carrier';
      if (status === 'accepted') {
        await createStatusUpdateNotification(
          parcelRequest.sender._id || parcelRequest.sender,
          'Parcel Request Accepted! 🎉',
          `${carrierName} has accepted your parcel delivery request.`,
          '/myparcel'
        );
      } else if (status === 'rejected') {
        await createStatusUpdateNotification(
          parcelRequest.sender._id || parcelRequest.sender,
          'Parcel Request Declined',
          `${carrierName} was unable to accept your parcel delivery request. You can search for other trips.`,
          '/search'
        );
      }
    } catch (notifErr) {
      console.error('Failed to send status notification:', notifErr);
    }

    res.json(parcelRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};