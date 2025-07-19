const ChatSession = require('../db/chatSession');

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
    if (!sessionId && !userId) {
      return res.status(400).json({ error: 'sessionId or userId is required.' });
    }
    let sessions;
    if (sessionId) {
      sessions = await ChatSession.find({ sessionId });
    } else if (userId) {
      sessions = await ChatSession.find({ userId });
    }
    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
}; 