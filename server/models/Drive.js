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
  workMode: {
    type: String,
    default: 'On-Site'
  },
  responsibilities: [{
    type: String,
    trim: true
  }],
  graduationYear: {
    type: String,
    default: '2025–2026 Batch'
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'cancelled'],
    default: 'active'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Drive', DriveSchema);
