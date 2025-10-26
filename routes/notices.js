const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const authMiddleware = require('../middleware/auth');

router.post('/create', authMiddleware, noticeController.createNotice);
router.get('/all', noticeController.getAllNotices);
router.get('/latest', noticeController.getLatestNotice);
router.delete('/:id', authMiddleware, noticeController.deleteNotice);

module.exports = router;
