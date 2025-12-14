// Test what's being exported from controllers
console.log('=== Testing Controller Imports ===\n');

try {
  const flightController = require('./controllers/flightController');
  console.log('✅ Flight Controller imported');
  console.log('Type:', typeof flightController);
  console.log('Keys:', Object.keys(flightController));
  console.log('searchFlights:', typeof flightController.searchFlights);
  console.log('getAllFlights:', typeof flightController.getAllFlights);
  console.log('getFlightById:', typeof flightController.getFlightById);
} catch (err) {
  console.log('❌ Flight Controller error:', err.message);
}

console.log('\n---\n');

try {
  const userController = require('./controllers/userController');
  console.log('✅ User Controller imported');
  console.log('Type:', typeof userController);
  console.log('Keys:', Object.keys(userController));
} catch (err) {
  console.log('❌ User Controller error:', err.message);
}