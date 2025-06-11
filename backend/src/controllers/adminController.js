const User = require('../models/User');
const Trip = require('../models/Trip');
const ParcelRequest = require('../models/ParcelRequest');
const Payment = require('../models/Payment');

// Get user analytics
exports.getUserAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const usersByVerificationStatus = await User.aggregate([
      { $group: { _id: '$verificationStatus', count: { $sum: 1 } } }
    ]);
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({
      totalUsers,
      newUsersToday,
      verifiedUsers,
      usersByVerificationStatus,
      userGrowth
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get parcel analytics
exports.getParcelAnalytics = async (req, res) => {
  try {
    const totalParcels = await ParcelRequest.countDocuments();
    const parcelsByStatus = await ParcelRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const parcelsByPaymentStatus = await ParcelRequest.aggregate([
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
    ]);
    const parcelsByCategory = await ParcelRequest.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const avgParcelWeight = await ParcelRequest.aggregate([
      { $group: { _id: null, avgWeight: { $avg: '$weight' } } }
    ]);

    res.json({
      totalParcels,
      parcelsByStatus,
      parcelsByPaymentStatus,
      parcelsByCategory,
      avgParcelWeight: avgParcelWeight[0]?.avgWeight || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get trip analytics
exports.getTripAnalytics = async (req, res) => {
  try {
    const totalTrips = await Trip.countDocuments();
    const tripsByStatus = await Trip.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const tripsByTransport = await Trip.aggregate([
      { $group: { _id: '$transport', count: { $sum: 1 } } }
    ]);
    const avgCapacity = await Trip.aggregate([
      { 
        $group: { 
          _id: null, 
          avgWeight: { $avg: '$capacityWeight' },
          avgVolume: { $avg: '$capacityVolume' }
        } 
      }
    ]);

    res.json({
      totalTrips,
      tripsByStatus,
      tripsByTransport,
      avgCapacity: avgCapacity[0] || { avgWeight: 0, avgVolume: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payment analytics
exports.getPaymentAnalytics = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const paymentsByStatus = await Payment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const avgOrderAmount = await Payment.aggregate([
      { $group: { _id: null, avg: { $avg: '$amount' } } }
    ]);
    const revenueByMonth = await Payment.aggregate([
      { $match: { status: 'succeeded' } },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({
      totalPayments,
      totalRevenue: totalRevenue[0]?.total || 0,
      paymentsByStatus,
      avgOrderAmount: avgOrderAmount[0]?.avg || 0,
      revenueByMonth
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get location analytics
exports.getLocationAnalytics = async (req, res) => {
  try {
    // Most popular source locations
    const popularSourceLocations = await Trip.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Most popular destination locations
    const popularDestinationLocations = await Trip.aggregate([
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Popular routes (source-destination pairs)
    const popularRoutes = await Trip.aggregate([
      { 
        $group: { 
          _id: { source: '$source', destination: '$destination' }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      popularSourceLocations,
      popularDestinationLocations,
      popularRoutes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Process AI query
exports.processAIQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    // This is a placeholder for AI processing logic
    // In a real implementation, you would integrate with an AI service
    // For now, we'll return some mock data based on the query
    
    let response = "I don't have enough information to answer that question.";
    
    if (query.toLowerCase().includes('user')) {
      const totalUsers = await User.countDocuments();
      response = `There are currently ${totalUsers} users registered in the system.`;
    } else if (query.toLowerCase().includes('parcel')) {
      const totalParcels = await ParcelRequest.countDocuments();
      response = `There are currently ${totalParcels} parcel requests in the system.`;
    } else if (query.toLowerCase().includes('payment') || query.toLowerCase().includes('revenue')) {
      const totalRevenue = await Payment.aggregate([
        { $match: { status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      response = `The total revenue from successful payments is $${(totalRevenue[0]?.total / 100).toFixed(2)}.`;
    }
    
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};