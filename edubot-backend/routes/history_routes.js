const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history_controller');

// POST /api/history - Save a message to a session
router.post('/history', historyController.saveMessage);

// GET /api/history - Get chat history by sessionId or userId
router.get('/history', historyController.getHistory);

// DELETE /api/history/:id - Delete a chat session by id
router.delete('/history/:id', historyController.deleteHistory);

module.exports = router; 