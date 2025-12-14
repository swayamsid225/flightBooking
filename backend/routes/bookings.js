const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// IMPORTANT: More specific routes must come BEFORE general routes
// Otherwise /:id will match "attempts" as an id

// Check booking attempts (MUST BE BEFORE /:id route)
router.get('/attempts/:flightId', auth, bookingController.checkAttempts);

// Create booking
router.post('/', auth, bookingController.createBooking);

// Get all bookings
router.get('/', auth, bookingController.getBookings);

// Get single booking (MUST BE AFTER /attempts route)
router.get('/:id', auth, bookingController.getBookingById);

// Download ticket
router.get('/:id/download', auth, bookingController.downloadTicket);

module.exports = router;