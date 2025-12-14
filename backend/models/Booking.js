const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
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
  amount_paid: {
    type: Number,
    required: true
  },
  pnr: {
    type: String,
    required: true,
    unique: true
  },
  passenger_name: String,
  passenger_email: String,
  flight_details: {
    flight_id: String,
    airline: String,
    departure_city: String,
    arrival_city: String,
    departure_time: String,
    arrival_time: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);