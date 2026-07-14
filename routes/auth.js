const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes'
  }
});


// Public Routes

router.post(
  '/login',
  loginLimiter,
  authController.login
);

router.post(
  '/register',
  authController.registerTeacher
);


// Protected Routes

router.post(
  '/change-password',
  authMiddleware,
  authController.changePassword
);

router.get(
  '/pending-teachers',
  authMiddleware,
  adminMiddleware,
  authController.getPendingTeachers
);

router.patch(
  '/approve/:id',
  authMiddleware,
  adminMiddleware,
  authController.approveTeacher
);

router.patch(
  '/reject/:id',
  authMiddleware,
  adminMiddleware,
  authController.rejectTeacher
);

router.get(
    '/me',
    authMiddleware,
    authController.getCurrentUser
);

module.exports = router;
