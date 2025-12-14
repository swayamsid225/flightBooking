const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const flightRoutes = require('./routes/flights');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const { resetSurgePricing } = require('./utils/surgePricing');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database Connection (FIXED)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flight-booking')
.then(() => {
  console.log('✅ MongoDB Connected');
  console.log('🔥 Dynamic Pricing Engine: ACTIVE');
})
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/flights', flightRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

// CRON JOB - Reset surge pricing every minute
cron.schedule('* * * * *', async () => {
  const count = await resetSurgePricing();
  if (count > 0) {
    console.log(`⏰ Cron: Reset ${count} flight(s)`);
  }
});

console.log('⏰ Cron job active: Checking surge pricing every minute');

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    dynamicPricing: 'active',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
});