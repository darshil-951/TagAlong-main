const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

// Get all notifications for the authenticated user
router.get('/', auth, notificationController.getUserNotifications);

// Mark a notification as read
router.patch('/:id/read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/read-all', auth, notificationController.markAllAsRead);

// Create a new notification (admin/system route)
router.post('/', auth, notificationController.createNotification);

// Delete a notification
router.delete('/:id', auth, notificationController.deleteNotification);

module.exports = router;