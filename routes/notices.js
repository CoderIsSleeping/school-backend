const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const authMiddleware = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');

router.post('/create', authMiddleware, allowRoles('admin'),noticeController.createNotice);
router.get('/all', noticeController.getAllNotices);
router.get('/latest', noticeController.getLatestNotice);
router.delete('/:id', authMiddleware, allowRoles('admin'),noticeController.deleteNotice);

module.exports = router;
