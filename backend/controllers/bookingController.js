const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const User = require('../models/User');
const Attempt = require('../models/Attempt');
const { generatePDF } = require('../utils/pdfGenerator');
const { checkAndApplySurge } = require('../utils/surgePricing');

// Create a new booking
async function createBooking(req, res) {
  try {
    const { flightId } = req.body;
    const userId = req.user._id;

    console.log(`\n💳 NEW BOOKING ATTEMPT`);
    console.log(`   User: ${req.user.name}`);
    console.log(`   Flight ID: ${flightId}`);

    const flight = await Flight.findById(flightId);
    const user = await User.findById(userId);

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    // CHECK AND APPLY SURGE PRICING
    await checkAndApplySurge(userId, flightId);
    
    // Refresh flight data
    const updatedFlight = await Flight.findById(flightId);

    console.log(`   Price: ₹${updatedFlight.current_price}`);
    console.log(`   Surge: ${updatedFlight.surge_active ? 'YES' : 'NO'}`);

    // Check wallet balance
    if (user.wallet_balance < updatedFlight.current_price) {
      return res.status(400).json({ 
        error: 'Insufficient wallet balance',
        required: updatedFlight.current_price,
        available: user.wallet_balance
      });
    }

    // Deduct from wallet
    user.wallet_balance -= updatedFlight.current_price;
    await user.save();

    // Generate PNR
    const pnr = 'PNR' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Create booking
    const booking = new Booking({
      user: userId,
      flight: flightId,
      amount_paid: updatedFlight.current_price,
      pnr,
      passenger_name: user.name,
      passenger_email: user.email,
      flight_details: {
        flight_id: updatedFlight.flight_id,
        airline: updatedFlight.airline,
        departure_city: updatedFlight.departure_city,
        arrival_city: updatedFlight.arrival_city,
        departure_time: updatedFlight.departure_time,
        arrival_time: updatedFlight.arrival_time
      }
    });

    await booking.save();

    console.log(`   ✅ BOOKING SUCCESSFUL - PNR: ${pnr}\n`);

    // Generate PDF
    const pdfPath = await generatePDF(booking, user, updatedFlight);

    return res.status(201).json({
      booking,
      pdfPath,
      message: 'Booking successful',
      surgeApplied: updatedFlight.surge_active
    });
  } catch (error) {
    console.error('❌ Booking error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Get all bookings for logged in user
async function getBookings(req, res) {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('flight')
      .sort({ createdAt: -1 });
    
    return res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Get single booking by ID
async function getBookingById(req, res) {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('flight');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Download ticket PDF
async function downloadTicket(req, res) {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('flight');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const user = await User.findById(req.user._id);
    const flight = await Flight.findById(booking.flight);

    const pdfPath = await generatePDF(booking, user, flight);
    return res.download(pdfPath);
  } catch (error) {
    console.error('Download ticket error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Check booking attempts (for frontend warning)
async function checkAttempts(req, res) {
  try {
    const { flightId } = req.params;
    const userId = req.user._id;

    // Count attempts in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const attemptCount = await Attempt.countDocuments({
      user: userId,
      flight: flightId,
      timestamp: { $gte: fiveMinutesAgo }
    });

    // Get flight info
    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    // Will surge on next attempt?
    const willSurge = attemptCount >= 2 && !flight.surge_active;

    return res.json({
      attemptCount,
      surgeActive: flight.surge_active,
      currentPrice: flight.current_price,
      basePrice: flight.base_price,
      willSurge,
      message: willSurge 
        ? 'Warning: One more attempt will trigger surge pricing (+10%)'
        : null
    });
  } catch (error) {
    console.error('Check attempts error:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  downloadTicket,
  checkAttempts
};