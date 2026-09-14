const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  studentNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  gradYear: {
    type: Number,
    required: true
  },
  cgpa: {
    type: Number,
    default: 0
  },
  tenthPct: {
    type: Number
  },
  twelfthPct: {
    type: Number
  },
  backlogs: {
    type: Number,
    default: 0
  },
  skills: [{
    type: String,
    trim: true
  }],
  softSkills: {
    type: String
  },
  certifications: {
    type: String
  },
  projects: {
    type: String
  },
  internships: {
    type: String
  },
  resumeFilename: {
    type: String
  },
  resumeOriginalName: {
    type: String
  },
  resumeLatex: {
    type: String
  },
  resumeData: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);
