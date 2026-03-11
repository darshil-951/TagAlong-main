const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/auth');
const multer = require('multer');

// Configure multer for file uploads in memory (for cloud deployment)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Avatar upload endpoint
router.post('/avatar', authenticate, upload.single('avatar'), userController.uploadAvatar);

// User CRUD endpoints
router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

// Update email
router.patch('/update-email', authenticate, userController.updateEmail);

// Update phone
router.patch('/update-phone', authenticate, userController.updatePhone);

// Change password
router.put('/change-password', authenticate, userController.changePassword);

// Delete account
router.delete('/delete-account', authenticate, userController.deleteAccount);

module.exports = router;