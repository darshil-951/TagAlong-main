const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');

// Apply both auth middlewares to all admin routes
router.use(auth);
router.use(adminAuth);

// Analytics routes
router.get('/analytics/users', adminController.getUserAnalytics);
router.get('/analytics/parcels', adminController.getParcelAnalytics);
router.get('/analytics/trips', adminController.getTripAnalytics);
router.get('/analytics/payments', adminController.getPaymentAnalytics);
router.get('/analytics/locations', adminController.getLocationAnalytics);

// AI agent route
router.post('/ai/query', adminController.processAIQuery);

// User management routes
router.post('/users/set-admin', userController.setUserAsAdmin);

module.exports = router;