const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/create-user', authController.createUser); // Use once, then remove
router.post('/change-password', authController.changePassword);


module.exports = router;
