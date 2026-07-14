const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');

router.post('/upload', authMiddleware,allowRoles('admin','teacher'), imageController.uploadImage);
router.get('/all', imageController.getAllImages);
router.delete('/:id', authMiddleware,allowRoles('admin'), imageController.deleteImage);

module.exports = router;
