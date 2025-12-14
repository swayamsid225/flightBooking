const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  flight_id: {
    type: String,
    required: true,
    unique: true
  },
  airline: {
    type: String,
    required: true
  },
  departure_city: {
    type: String,
    required: true
  },
  arrival_city: {
    type: String,
    required: true
  },
  base_price: {
    type: Number,
    required: true,
    min: 2000,
    max: 3000
  },
  current_price: {
    type: Number,
    required: true
  },
  departure_time: {
    type: String,
    required: true
  },
  arrival_time: {
    type: String,
    required: true
  },
  surge_active: {
    type: Boolean,
    default: false
  },
  surge_end_time: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Flight', FlightSchema);