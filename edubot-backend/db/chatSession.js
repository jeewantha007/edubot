const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: String }, // optional, for future use
  messages: [messageSchema],
  mcqState: { type: Object }, // optional, for MCQ progress
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatSession', chatSessionSchema); 