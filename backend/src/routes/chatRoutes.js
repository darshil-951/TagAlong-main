const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticate = require('../middlewares/auth');
const multer = require('multer');

// Configure multer for memory storage (buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Get chat history between two users
router.get('/history', authenticate, chatController.getChatHistory);

// Get all chats for a user
router.get('/user/:userId', authenticate, chatController.getUserChats);

// Upload image for chat
router.post('/upload-image', authenticate, upload.single('image'), chatController.uploadImage);

module.exports = router;