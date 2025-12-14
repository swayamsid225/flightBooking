const Attempt = require('../models/Attempt');
const Flight = require('../models/Flight');

async function checkAndApplySurge(userId, flightId) {
  try {
    console.log('\n🔍 === SURGE PRICING CHECK ===');
    console.log(`User ID: ${userId}`);
    console.log(`Flight ID: ${flightId}`);

    // Log this attempt FIRST
    const newAttempt = new Attempt({
      user: userId,
      flight: flightId,
      timestamp: new Date()
    });
    await newAttempt.save();
    console.log('✅ Attempt logged');

    // Count attempts in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentAttempts = await Attempt.countDocuments({
      user: userId,
      flight: flightId,
      timestamp: { $gte: fiveMinutesAgo }
    });

    console.log(`📊 Recent attempts (last 5 min): ${recentAttempts}`);

    // Get current flight status
    const flight = await Flight.findById(flightId);
    console.log(`Current flight price: ₹${flight.current_price}`);
    console.log(`Base price: ₹${flight.base_price}`);
    console.log(`Surge already active: ${flight.surge_active}`);

    // Apply surge if >= 3 attempts AND not already active
    if (recentAttempts >= 3) {
      console.log('⚠️  3+ attempts detected!');
      
      if (!flight.surge_active) {
        console.log('🔥 APPLYING SURGE PRICING...');
        
        const newPrice = Math.floor(flight.base_price * 1.1);
        flight.current_price = newPrice;
        flight.surge_active = true;
        flight.surge_end_time = new Date(Date.now() + 10 * 60 * 1000);
        
        await flight.save();
        
        console.log(`✅ SURGE ACTIVATED!`);
        console.log(`   Old Price: ₹${flight.base_price}`);
        console.log(`   New Price: ₹${newPrice} (+10%)`);
        console.log(`   Will reset at: ${flight.surge_end_time.toLocaleTimeString()}`);
      } else {
        console.log('ℹ️  Surge already active, keeping current price');
      }
    } else {
      console.log(`ℹ️  Only ${recentAttempts} attempt(s), need 3 to trigger surge`);
    }

    console.log('='.repeat(40) + '\n');
    return recentAttempts;
  } catch (error) {
    console.error('❌ Surge pricing error:', error);
    throw error;
  }
}

async function resetSurgePricing() {
  try {
    const now = new Date();
    const flights = await Flight.find({
      surge_active: true,
      surge_end_time: { $lte: now }
    });

    if (flights.length > 0) {
      console.log(`\n🔄 Resetting ${flights.length} flight(s)...`);
    }

    for (const flight of flights) {
      console.log(`   ✅ ${flight.flight_id}: ₹${flight.current_price} → ₹${flight.base_price}`);
      
      flight.current_price = flight.base_price;
      flight.surge_active = false;
      flight.surge_end_time = null;
      
      await flight.save();
    }

    return flights.length;
  } catch (error) {
    console.error('❌ Reset surge pricing error:', error);
    return 0;
  }
}

module.exports = {
  checkAndApplySurge,
  resetSurgePricing
};