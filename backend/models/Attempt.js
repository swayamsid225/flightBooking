const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for efficient queries
AttemptSchema.index({ user: 1, flight: 1, timestamp: 1 });

// TTL index - automatically delete attempts older than 5 minutes (300 seconds)
AttemptSchema.index({ timestamp: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model('Attempt', AttemptSchema);