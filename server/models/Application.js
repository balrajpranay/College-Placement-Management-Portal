const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  drive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Withdrawn'],
    default: 'Applied'
  }
}, {
  timestamps: true
});

// Composite unique index to prevent duplicate applications
ApplicationSchema.index({ student: 1, drive: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
