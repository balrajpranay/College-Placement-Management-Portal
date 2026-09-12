const mongoose = require('mongoose');

const PlacementResultSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  drive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive'
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  package: {
    type: Number
  },
  placementDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Waiting', 'Selected', 'Rejected'],
    default: 'Waiting'
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.PlacementResult || mongoose.model('PlacementResult', PlacementResultSchema);
