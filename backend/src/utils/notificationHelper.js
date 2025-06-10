const Notification = require('../models/notification');

/**
 * Create a system notification for a user
 * @param {string} userId - The user ID to send notification to
 * @param {string} title - Notification title
 * @param {string} content - Notification content
 * @param {string} actionUrl - Optional URL for action button
 * @param {Object} metadata - Optional additional data
 */
exports.createSystemNotification = async (userId, title, content, actionUrl = null, metadata = {}) => {
  try {
    const notification = new Notification({
      userId,
      type: 'system',
      title,
      content,
      actionUrl,
      metadata
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating system notification:', error);
    throw error;
  }
};

/**
 * Create a message notification when a user receives a new message
 */
exports.createMessageNotification = async (userId, senderName, messagePreview, chatId) => {
  try {
    const notification = new Notification({
      userId,
      type: 'message',
      title: `New message from ${senderName}`,
      content: messagePreview.substring(0, 100) + (messagePreview.length > 100 ? '...' : ''),
      actionUrl: `/messages?id=${chatId}`,
      metadata: { chatId, senderId: senderName }
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating message notification:', error);
    throw error;
  }
};

/**
 * Create a parcel request notification
 */
exports.createParcelRequestNotification = async (carrierId, senderName, parcelDetails, parcelId) => {
  try {
    const notification = new Notification({
      userId: carrierId,
      type: 'request',
      title: `New Parcel Request`,
      content: `${senderName} wants to send a ${parcelDetails.weight}kg parcel with you.`,
      actionUrl: `/parcels/${parcelId}`,
      metadata: { parcelId, senderName }
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating parcel request notification:', error);
    throw error;
  }
};

/**
 * Create a status update notification
 */
exports.createStatusUpdateNotification = async (userId, title, content, actionUrl = null, metadata = {}) => {
  try {
    const notification = new Notification({
      userId,
      type: 'status_update',
      title,
      content,
      actionUrl,
      metadata
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating status update notification:', error);
    throw error;
  }
};

/**
 * Create a payment notification
 */
exports.createPaymentNotification = async (userId, payerName, amount, parcelId, paymentDetails) => {
  try {
    const notification = new Notification({
      userId,
      type: 'status_update',
      title: `Payment Received`,
      content: `${payerName} has made a payment of ₹${amount} for parcel delivery.`,
      actionUrl: `/myparcel`,
      metadata: { 
        parcelId, 
        amount, 
        payerName,
        ...paymentDetails
      }
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating payment notification:', error);
    throw error;
  }
};