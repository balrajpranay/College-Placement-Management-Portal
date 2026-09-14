const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recipientRole: {
    type: String,
    enum: ['student', 'recruiter', 'admin', 'all'],
    default: 'student'
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  title: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info'
  },
  link: {
    type: String
  },
  meetUrl: {
    type: String
  },
  roundName: {
    type: String
  },
  scheduledDate: {
    type: String
  },
  scheduledTime: {
    type: String
  },
  instructions: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
