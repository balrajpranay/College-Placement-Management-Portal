const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  interviewType: {
    type: String,
    default: 'Online'
  },
  venue: {
    type: String
  },
  roundName: {
    type: String,
    default: 'Round 1'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', InterviewSchema);
