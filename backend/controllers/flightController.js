const Flight = require('../models/Flight');

async function searchFlights(req, res) {
  try {
    const { from, to, sortBy } = req.query;
    
    let query = {};
    if (from) query.departure_city = new RegExp(from, 'i');
    if (to) query.arrival_city = new RegExp(to, 'i');

    let flights = await Flight.find(query).limit(10);

    if (sortBy === 'price') {
      flights.sort((a, b) => a.current_price - b.current_price);
    } else if (sortBy === 'airline') {
      flights.sort((a, b) => a.airline.localeCompare(b.airline));
    }

    return res.json(flights);
  } catch (error) {
    console.error('Search flights error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getFlightById(req, res) {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    return res.json(flight);
  } catch (error) {
    console.error('Get flight error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getAllFlights(req, res) {
  try {
    const flights = await Flight.find();
    return res.json(flights);
  } catch (error) {
    console.error('Get all flights error:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  searchFlights,
  getFlightById,
  getAllFlights
};