const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  hrContact: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  logoFilename: {
    type: String
  },
  approved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', CompanySchema);
