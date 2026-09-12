const mongoose = require('mongoose');

const PlacementResultSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: true
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

module.exports = mongoose.model('PlacementResult', PlacementResultSchema);
