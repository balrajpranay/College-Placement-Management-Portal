const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: function() {
      return this.authProvider === 'local' && !this.googleId && !this.githubId;
    }
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'recruiter'],
    required: [true, 'Role is required']
  },
  name: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  googleId: {
    type: String,
    sparse: true
  },
  githubId: {
    type: String,
    sparse: true
  },
  githubUsername: {
    type: String,
    trim: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'github', 'google'],
    default: 'local'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
