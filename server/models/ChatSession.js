const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'model', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mode: {
    type: String,
    enum: ['advisor', 'tutor', 'chat'],
    default: 'advisor'
  },
  messages: [MessageSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ChatSessionSchema.index({ user: 1, mode: 1 }, { unique: true });

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
