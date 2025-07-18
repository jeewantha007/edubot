const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chat_controller');

// Route for handling chat requests
router.post('/chat', handleChat);

module.exports = router;
