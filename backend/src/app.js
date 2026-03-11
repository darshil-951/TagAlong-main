const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const parcelRoutes = require('./routes/parcelRoutes');
const chatRoutes = require('./routes/chatRoutes');
const Message = require('./models/Message');
const { decrypt } = require('./utils/encryption');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Configure CORS for production
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173'];

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Stripe webhook needs raw body BEFORE express.json() parses it
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/parcel', parcelRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');
  const userId = socket.handshake.query.userId;

  if (userId) {
    // Store user connection
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);
  }

  // Handle sending messages
  socket.on('send_message', async (message, callback) => {
    try {
      // Create new message in database (encryption happens in pre-save hook)
      const newMessage = new Message({
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        type: message.type || 'text',
        metadata: message.metadata || null,
        timestamp: message.timestamp || Date.now(),
        status: 'sent'
      });

      await newMessage.save();

      // Check if recipient is online
      const recipientSocketId = connectedUsers.get(message.receiverId);

      if (recipientSocketId) {
        // Send message to recipient with decrypted content for frontend
        const messageForClient = newMessage.toObject();
        messageForClient.content = newMessage.decryptContent();

        io.to(recipientSocketId).emit('new_message', messageForClient);

        // Update message status to delivered
        newMessage.status = 'delivered';
        await newMessage.save();
      }

      // Send acknowledgment back to sender with decrypted content
      const responseMessage = newMessage.toObject();
      responseMessage.content = newMessage.decryptContent();
      callback({ success: true, message: responseMessage });
    } catch (error) {
      console.error('Error sending message:', error);
      callback({ success: false, error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const recipientSocketId = connectedUsers.get(data.receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing_start', { userId: data.senderId });
    }
  });

  socket.on('typing_end', (data) => {
    const recipientSocketId = connectedUsers.get(data.receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing_end', { userId: data.senderId });
    }
  });

  // Handle chat history requests
  socket.on('get_chat_history', async (data, callback) => {
    try {
      const { userId1, userId2 } = data;

      // Find messages between these users
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

      callback({ success: true, messages: decryptedMessages });

      // Mark messages as read
      await Message.updateMany(
        { senderId: userId2, receiverId: userId1, status: { $ne: 'read' } },
        { status: 'read' }
      );
    } catch (error) {
      console.error('Error fetching chat history:', error);
      callback({ success: false, error: 'Failed to fetch chat history' });
    }
  });

  // Handle user chats requests
  socket.on('get_user_chats', async (data, callback) => {
    try {
      const { userId } = data;

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
        const partner = await mongoose.model('User').findById(partnerId)
          .select('name avatar verificationStatus');

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

      callback({ success: true, chats });
    } catch (error) {
      console.error('Error fetching user chats:', error);
      callback({ success: false, error: 'Failed to fetch user chats' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');

    // Remove user from connected users
    if (userId) {
      connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  });
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
