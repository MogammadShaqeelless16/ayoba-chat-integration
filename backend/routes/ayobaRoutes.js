const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/ayobaController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/send-message', authMiddleware, sendMessage);
router.get('/get-messages', authMiddleware, getMessages);

module.exports = router;
