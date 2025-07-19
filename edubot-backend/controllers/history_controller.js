const ChatSession = require('../db/chatSession');
const mongoose = require('mongoose');

// POST /api/history - Save a message to a session
exports.saveMessage = async (req, res) => {
  try {
    const { sessionId, userId, message } = req.body;
    if (!sessionId || !message || !message.text || !message.role) {
      return res.status(400).json({ error: 'sessionId and message (with text and role) are required.' });
    }
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = new ChatSession({ sessionId, userId, messages: [message] });
    } else {
      if (userId && !session.userId) session.userId = userId;
      session.messages.push(message);
    }
    await session.save();
    res.json({ success: true, session });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message.' });
  }
};

// GET /api/history?sessionId=... or /api/history?userId=...
exports.getHistory = async (req, res) => {
  try {
    const { sessionId, userId } = req.query;
    let sessions;
    if (sessionId) {
      sessions = await ChatSession.find({ sessionId });
    } else if (userId) {
      sessions = await ChatSession.find({ userId });
    } else {
      // If neither is provided, return all sessions (for device-wide history)
      sessions = await ChatSession.find({});
    }
    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
};

// DELETE /api/history/:id - Delete a chat session by MongoDB _id or sessionId
exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'id is required.' });
    }
    let result;
    if (mongoose.Types.ObjectId.isValid(id)) {
      result = await ChatSession.deleteOne({ _id: id });
      if (result.deletedCount > 0) {
        return res.json({ success: true });
      }
    }
    // If not a valid ObjectId or not found, try by sessionId
    result = await ChatSession.deleteOne({ sessionId: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Session not found.' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({ error: 'Failed to delete chat session.' });
  }
};

// PATCH /api/history/:id - Rename a chat session's title/topic by _id or sessionId
exports.updateHistoryTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!id || !title) {
      return res.status(400).json({ error: 'id and title are required.' });
    }
    let result;
    // Only try _id if id is a valid ObjectId and matches the 24-char hex format
    if (mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id) {
      result = await ChatSession.updateOne({ _id: id }, { $set: { title } });
      if (result.matchedCount > 0) {
        return res.json({ success: true });
      }
    }
    // Otherwise, try by sessionId
    result = await ChatSession.updateOne({ sessionId: id }, { $set: { title } });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Session not found.' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error renaming chat session:', error);
    res.status(500).json({ error: 'Failed to rename chat session.' });
  }
};

// PATCH /api/history/:sessionId/message/:messageId - Edit a user message in a chat session
exports.editMessage = async (req, res) => {
  try {
    const { sessionId, messageId } = req.params;
    const { text } = req.body;
    if (!sessionId || !messageId || !text) {
      return res.status(400).json({ error: 'sessionId, messageId, and text are required.' });
    }
    const session = await ChatSession.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    const msg = session.messages.id(messageId);
    if (!msg) return res.status(404).json({ error: 'Message not found.' });
    // Only allow editing user messages
    if (msg.role !== 'user') return res.status(403).json({ error: 'Only user messages can be edited.' });
    msg.text = text;
    await session.save();
    res.json({ success: true, message: msg });
  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({ error: 'Failed to edit message.' });
  }
}; 