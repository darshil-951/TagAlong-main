const Message = require('../models/Message');
const User = require('../models/User');

// Get chat history between two users
exports.getChatHistory = async (req, res) => {
  try {
    const { userId1, userId2 } = req.query;
    
    if (!userId1 || !userId2) {
      return res.status(400).json({ error: 'Both user IDs are required' });
    }
    
    // Find messages where either user is sender and the other is receiver
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ timestamp: 1 });
    
    // Decrypt message content for frontend
    const decryptedMessages = messages.map(msg => {
      const msgObj = msg.toObject();
      msgObj.content = msg.decryptContent();
      return msgObj;
    });
    
    res.json(decryptedMessages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// Get all chats for a user
exports.getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Find all unique users this user has chatted with
    const sentMessages = await Message.find({ senderId: userId })
      .distinct('receiverId');
      
    const receivedMessages = await Message.find({ receiverId: userId })
      .distinct('senderId');
    
    // Combine and remove duplicates
    const chatPartnerIds = [...new Set([...sentMessages, ...receivedMessages])];
    
    // Get the latest message for each chat
    const chats = [];
    
    for (const partnerId of chatPartnerIds) {
      // Get partner user details
      const partner = await User.findById(partnerId).select('name avatar verificationStatus');
      
      if (!partner) continue;
      
      // Get the latest message
      const latestMessage = await Message.findOne({
        $or: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
        ]
      }).sort({ timestamp: -1 });
      
      // Count unread messages
      const unreadCount = await Message.countDocuments({
        senderId: partnerId,
        receiverId: userId,
        status: { $ne: 'read' }
      });
      
      chats.push({
        user: {
          _id: partner._id,
          name: partner.name,
          avatar: partner.avatar,
          verificationStatus: partner.verificationStatus
        },
        lastMessage: {
          content: latestMessage.decryptContent(), // Decrypt for frontend
          timestamp: latestMessage.timestamp,
          createdAt: latestMessage.createdAt
        },
        unreadCount
      });
    }
    
    // Sort by latest message
    chats.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
    
    res.json(chats);
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({ error: 'Failed to fetch user chats' });
  }
};

// Upload an image for chat
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Convert buffer to data URI for immediate efficient rendering
    const mimeType = req.file.mimetype || 'image/jpeg';
    const base64string = req.file.buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64string}`;
    
    // Return the data URI directly as the URL
    res.status(200).json({ imageUrl: dataUri });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};