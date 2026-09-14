const mongoose = require('mongoose');

const DriveSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  ctc: {
    type: Number,
    default: 0
  },
  location: {
    type: String
  },
  jobType: {
    type: String,
    default: 'Full-Time'
  },
  category: {
    type: String,
    default: 'Placements'
  },
  opportunityType: {
    type: String,
    default: 'Placement'
  },
  minCgpa: {
    type: Number,
    default: 0
  },
  maxBacklogs: {
    type: Number,
    default: 0
  },
  openings: {
    type: Number,
    default: 1
  },
  deadline: {
    type: Date,
    required: true
  },
  driveDate: {
    type: Date
  },
  branches: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Drive', DriveSchema);
