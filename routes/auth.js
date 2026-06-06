const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Strict rate limit on login to prevent brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' }
});

router.post('/login', loginLimiter, authController.login);
router.post('/create-user', authMiddleware, authController.createUser); // Protected: only authenticated admins
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
