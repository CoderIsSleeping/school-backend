const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middleware/auth');

router.post('/upload', authMiddleware, imageController.uploadImage);
router.get('/all', imageController.getAllImages);
router.delete('/:id', authMiddleware, imageController.deleteImage);

module.exports = router;
