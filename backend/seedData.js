const mongoose = require('mongoose');
const Flight = require('./models/Flight');
require('dotenv').config();

const flights = [
  // Delhi to Mumbai - 10 flights
  { flight_id: 'AI-202', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Mumbai', base_price: 2500, current_price: 2500, departure_time: '06:00', arrival_time: '08:15' },
  { flight_id: '6E-204', airline: 'Indigo', departure_city: 'Delhi', arrival_city: 'Mumbai', base_price: 2300, current_price: 2300, departure_time: '07:30', arrival_time: '09:45' },
  { flight_id: 'SG-101', airline: 'SpiceJet', departure_city: 'Delhi', arrival_city: 'Mumbai', base_price: 2100, current_price: 2100, departure_time: '09:00', arrival_time: '11:15' },
  { flight_id: 'UK-305', airline: 'Vistara', departure_city: 'Delhi', arrival_city: 'Mumbai', base_price: 2800, current_price: 2800, departure_time: '10:30', arrival_time: '12:45' },
  { flight_id: 'AI-208', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Mumbai', base_price: 2600, current_price: 2600, departure_time: '12:00', arrival_time: '14:15' },
  { flight_id: '6E-210', airline: 'Indigo', departure_city: 'Delhi', arrival_city: 'Mumbai', base_price: 2400, current_price: 2400, departure_time: '14:30', arrival_time: '16:45' },
  { flight_id: 'SG-105', airline: 'SpiceJet', departure_city: 'Delhi', arrival_city: 'Mumbai', base_price: 2200, current_price: 2200, departure_time: '16:00', arrival_time: '18:15' },
  { flight_id: 'UK-310', airline: 'Vistara', departure_city: 'Delhi', arrival_city: 'Mumbai', base_price: 2900, current_price: 2900, departure_time: '18:30', arrival_time: '20:45' },
  { flight_id: 'AI-215', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Mumbai', base_price: 2700, current_price: 2700, departure_time: '20:00', arrival_time: '22:15' },
  { flight_id: '6E-220', airline: 'Indigo', departure_city: 'Delhi', arrival_city: 'Mumbai', base_price: 2350, current_price: 2350, departure_time: '22:30', arrival_time: '00:45' },

  // Mumbai to Delhi - 10 flights
  { flight_id: 'UK-901', airline: 'Vistara', departure_city: 'Mumbai', arrival_city: 'Delhi', base_price: 2500, current_price: 2500, departure_time: '05:30', arrival_time: '07:45' },
  { flight_id: 'AI-902', airline: 'Air India', departure_city: 'Mumbai', arrival_city: 'Delhi', base_price: 2550, current_price: 2550, departure_time: '07:00', arrival_time: '09:15' },
  { flight_id: '6E-903', airline: 'Indigo', departure_city: 'Mumbai', arrival_city: 'Delhi', base_price: 2300, current_price: 2300, departure_time: '09:30', arrival_time: '11:45' },
  { flight_id: 'SG-904', airline: 'SpiceJet', departure_city: 'Mumbai', arrival_city: 'Delhi', base_price: 2150, current_price: 2150, departure_time: '11:00', arrival_time: '13:15' },
  { flight_id: 'UK-905', airline: 'Vistara', departure_city: 'Mumbai', arrival_city: 'Delhi', base_price: 2750, current_price: 2750, departure_time: '13:30', arrival_time: '15:45' },
  { flight_id: 'AI-906', airline: 'Air India', departure_city: 'Mumbai', arrival_city: 'Delhi', base_price: 2600, current_price: 2600, departure_time: '15:00', arrival_time: '17:15' },
  { flight_id: '6E-907', airline: 'Indigo', departure_city: 'Mumbai', arrival_city: 'Delhi', base_price: 2400, current_price: 2400, departure_time: '17:30', arrival_time: '19:45' },
  { flight_id: 'SG-908', airline: 'SpiceJet', departure_city: 'Mumbai', arrival_city: 'Delhi', base_price: 2250, current_price: 2250, departure_time: '19:00', arrival_time: '21:15' },
  { flight_id: 'UK-909', airline: 'Vistara', departure_city: 'Mumbai', arrival_city: 'Delhi', base_price: 2850, current_price: 2850, departure_time: '21:30', arrival_time: '23:45' },
  { flight_id: 'AI-910', airline: 'Air India', departure_city: 'Mumbai', arrival_city: 'Delhi', base_price: 2650, current_price: 2650, departure_time: '23:00', arrival_time: '01:15' },

  // Delhi to Bangalore - 10 flights
  { flight_id: 'AI-601', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Bangalore', base_price: 2900, current_price: 2900, departure_time: '06:30', arrival_time: '09:15' },
  { flight_id: '6E-602', airline: 'Indigo', departure_city: 'Delhi', arrival_city: 'Bangalore', base_price: 2700, current_price: 2700, departure_time: '08:00', arrival_time: '10:45' },
  { flight_id: 'SG-603', airline: 'SpiceJet', departure_city: 'Delhi', arrival_city: 'Bangalore', base_price: 2500, current_price: 2500, departure_time: '10:30', arrival_time: '13:15' },
  { flight_id: 'UK-604', airline: 'Vistara', departure_city: 'Delhi', arrival_city: 'Bangalore', base_price: 3000, current_price: 3000, departure_time: '12:00', arrival_time: '14:45' },
  { flight_id: 'AI-605', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Bangalore', base_price: 2800, current_price: 2800, departure_time: '14:30', arrival_time: '17:15' },
  { flight_id: '6E-606', airline: 'Indigo', departure_city: 'Delhi', arrival_city: 'Bangalore', base_price: 2650, current_price: 2650, departure_time: '16:00', arrival_time: '18:45' },
  { flight_id: 'SG-607', airline: 'SpiceJet', departure_city: 'Delhi', arrival_city: 'Bangalore', base_price: 2550, current_price: 2550, departure_time: '18:30', arrival_time: '21:15' },
  { flight_id: 'UK-608', airline: 'Vistara', departure_city: 'Delhi', arrival_city: 'Bangalore', base_price: 2950, current_price: 2950, departure_time: '20:00', arrival_time: '22:45' },
  { flight_id: 'AI-609', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Bangalore', base_price: 2750, current_price: 2750, departure_time: '21:30', arrival_time: '00:15' },
  { flight_id: '6E-610', airline: 'Indigo', departure_city: 'Delhi', arrival_city: 'Bangalore', base_price: 2600, current_price: 2600, departure_time: '23:00', arrival_time: '01:45' },

  // Bangalore to Delhi - 10 flights
  { flight_id: '6E-222', airline: 'Indigo', departure_city: 'Bangalore', arrival_city: 'Delhi', base_price: 2850, current_price: 2850, departure_time: '05:00', arrival_time: '07:45' },
  { flight_id: 'AI-223', airline: 'Air India', departure_city: 'Bangalore', arrival_city: 'Delhi', base_price: 2950, current_price: 2950, departure_time: '07:30', arrival_time: '10:15' },
  { flight_id: 'SG-224', airline: 'SpiceJet', departure_city: 'Bangalore', arrival_city: 'Delhi', base_price: 2550, current_price: 2550, departure_time: '09:00', arrival_time: '11:45' },
  { flight_id: 'UK-225', airline: 'Vistara', departure_city: 'Bangalore', arrival_city: 'Delhi', base_price: 3000, current_price: 3000, departure_time: '11:30', arrival_time: '14:15' },
  { flight_id: '6E-226', airline: 'Indigo', departure_city: 'Bangalore', arrival_city: 'Delhi', base_price: 2700, current_price: 2700, departure_time: '13:00', arrival_time: '15:45' },
  { flight_id: 'AI-227', airline: 'Air India', departure_city: 'Bangalore', arrival_city: 'Delhi', base_price: 2900, current_price: 2900, departure_time: '15:30', arrival_time: '18:15' },
  { flight_id: 'SG-228', airline: 'SpiceJet', departure_city: 'Bangalore', arrival_city: 'Delhi', base_price: 2600, current_price: 2600, departure_time: '17:00', arrival_time: '19:45' },
  { flight_id: 'UK-229', airline: 'Vistara', departure_city: 'Bangalore', arrival_city: 'Delhi', base_price: 2950, current_price: 2950, departure_time: '19:30', arrival_time: '22:15' },
  { flight_id: '6E-230', airline: 'Indigo', departure_city: 'Bangalore', arrival_city: 'Delhi', base_price: 2750, current_price: 2750, departure_time: '21:00', arrival_time: '23:45' },
  { flight_id: 'AI-231', airline: 'Air India', departure_city: 'Bangalore', arrival_city: 'Delhi', base_price: 2800, current_price: 2800, departure_time: '22:30', arrival_time: '01:15' },

  // Mumbai to Bangalore - 10 flights
  { flight_id: 'AI-401', airline: 'Air India', departure_city: 'Mumbai', arrival_city: 'Bangalore', base_price: 2600, current_price: 2600, departure_time: '06:00', arrival_time: '07:30' },
  { flight_id: '6E-502', airline: 'Indigo', departure_city: 'Mumbai', arrival_city: 'Bangalore', base_price: 2400, current_price: 2400, departure_time: '08:00', arrival_time: '09:30' },
  { flight_id: 'SG-403', airline: 'SpiceJet', departure_city: 'Mumbai', arrival_city: 'Bangalore', base_price: 2250, current_price: 2250, departure_time: '10:00', arrival_time: '11:30' },
  { flight_id: 'UK-404', airline: 'Vistara', departure_city: 'Mumbai', arrival_city: 'Bangalore', base_price: 2750, current_price: 2750, departure_time: '12:00', arrival_time: '13:30' },
  { flight_id: 'AI-405', airline: 'Air India', departure_city: 'Mumbai', arrival_city: 'Bangalore', base_price: 2550, current_price: 2550, departure_time: '14:00', arrival_time: '15:30' },
  { flight_id: '6E-406', airline: 'Indigo', departure_city: 'Mumbai', arrival_city: 'Bangalore', base_price: 2350, current_price: 2350, departure_time: '16:00', arrival_time: '17:30' },
  { flight_id: 'SG-407', airline: 'SpiceJet', departure_city: 'Mumbai', arrival_city: 'Bangalore', base_price: 2300, current_price: 2300, departure_time: '18:00', arrival_time: '19:30' },
  { flight_id: 'UK-408', airline: 'Vistara', departure_city: 'Mumbai', arrival_city: 'Bangalore', base_price: 2800, current_price: 2800, departure_time: '20:00', arrival_time: '21:30' },
  { flight_id: 'AI-409', airline: 'Air India', departure_city: 'Mumbai', arrival_city: 'Bangalore', base_price: 2650, current_price: 2650, departure_time: '22:00', arrival_time: '23:30' },
  { flight_id: '6E-410', airline: 'Indigo', departure_city: 'Mumbai', arrival_city: 'Bangalore', base_price: 2450, current_price: 2450, departure_time: '23:30', arrival_time: '01:00' },

  // Bangalore to Mumbai - 10 flights
  { flight_id: 'AI-501', airline: 'Air India', departure_city: 'Bangalore', arrival_city: 'Mumbai', base_price: 2600, current_price: 2600, departure_time: '05:30', arrival_time: '07:00' },
  { flight_id: '6E-502B', airline: 'Indigo', departure_city: 'Bangalore', arrival_city: 'Mumbai', base_price: 2400, current_price: 2400, departure_time: '07:30', arrival_time: '09:00' },
  { flight_id: 'SG-503', airline: 'SpiceJet', departure_city: 'Bangalore', arrival_city: 'Mumbai', base_price: 2250, current_price: 2250, departure_time: '09:30', arrival_time: '11:00' },
  { flight_id: 'UK-504', airline: 'Vistara', departure_city: 'Bangalore', arrival_city: 'Mumbai', base_price: 2750, current_price: 2750, departure_time: '11:30', arrival_time: '13:00' },
  { flight_id: 'AI-505', airline: 'Air India', departure_city: 'Bangalore', arrival_city: 'Mumbai', base_price: 2550, current_price: 2550, departure_time: '13:30', arrival_time: '15:00' },
  { flight_id: '6E-506', airline: 'Indigo', departure_city: 'Bangalore', arrival_city: 'Mumbai', base_price: 2350, current_price: 2350, departure_time: '15:30', arrival_time: '17:00' },
  { flight_id: 'SG-507', airline: 'SpiceJet', departure_city: 'Bangalore', arrival_city: 'Mumbai', base_price: 2300, current_price: 2300, departure_time: '17:30', arrival_time: '19:00' },
  { flight_id: 'UK-508', airline: 'Vistara', departure_city: 'Bangalore', arrival_city: 'Mumbai', base_price: 2800, current_price: 2800, departure_time: '19:30', arrival_time: '21:00' },
  { flight_id: 'AI-509', airline: 'Air India', departure_city: 'Bangalore', arrival_city: 'Mumbai', base_price: 2650, current_price: 2650, departure_time: '21:30', arrival_time: '23:00' },
  { flight_id: '6E-510', airline: 'Indigo', departure_city: 'Bangalore', arrival_city: 'Mumbai', base_price: 2450, current_price: 2450, departure_time: '23:00', arrival_time: '00:30' },

  // Delhi to Chennai - 10 flights
  { flight_id: '6E-701', airline: 'Indigo', departure_city: 'Delhi', arrival_city: 'Chennai', base_price: 2700, current_price: 2700, departure_time: '06:00', arrival_time: '08:45' },
  { flight_id: 'AI-702', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Chennai', base_price: 2900, current_price: 2900, departure_time: '08:30', arrival_time: '11:15' },
  { flight_id: 'SG-703', airline: 'SpiceJet', departure_city: 'Delhi', arrival_city: 'Chennai', base_price: 2550, current_price: 2550, departure_time: '10:00', arrival_time: '12:45' },
  { flight_id: 'UK-704', airline: 'Vistara', departure_city: 'Delhi', arrival_city: 'Chennai', base_price: 2950, current_price: 2950, departure_time: '12:30', arrival_time: '15:15' },
  { flight_id: '6E-705', airline: 'Indigo', departure_city: 'Delhi', arrival_city: 'Chennai', base_price: 2650, current_price: 2650, departure_time: '14:00', arrival_time: '16:45' },
  { flight_id: 'AI-706', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Chennai', base_price: 2850, current_price: 2850, departure_time: '16:30', arrival_time: '19:15' },
  { flight_id: 'SG-707', airline: 'SpiceJet', departure_city: 'Delhi', arrival_city: 'Chennai', base_price: 2600, current_price: 2600, departure_time: '18:00', arrival_time: '20:45' },
  { flight_id: 'UK-708', airline: 'Vistara', departure_city: 'Delhi', arrival_city: 'Chennai', base_price: 3000, current_price: 3000, departure_time: '20:30', arrival_time: '23:15' },
  { flight_id: '6E-709', airline: 'Indigo', departure_city: 'Delhi', arrival_city: 'Chennai', base_price: 2750, current_price: 2750, departure_time: '22:00', arrival_time: '00:45' },
  { flight_id: 'AI-710', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Chennai', base_price: 2800, current_price: 2800, departure_time: '23:30', arrival_time: '02:15' },

  // Chennai to Delhi - 10 flights
  { flight_id: 'AI-801', airline: 'Air India', departure_city: 'Chennai', arrival_city: 'Delhi', base_price: 2750, current_price: 2750, departure_time: '05:00', arrival_time: '07:45' },
  { flight_id: '6E-802', airline: 'Indigo', departure_city: 'Chennai', arrival_city: 'Delhi', base_price: 2650, current_price: 2650, departure_time: '07:30', arrival_time: '10:15' },
  { flight_id: 'SG-803', airline: 'SpiceJet', departure_city: 'Chennai', arrival_city: 'Delhi', base_price: 2500, current_price: 2500, departure_time: '09:00', arrival_time: '11:45' },
  { flight_id: 'UK-804', airline: 'Vistara', departure_city: 'Chennai', arrival_city: 'Delhi', base_price: 2950, current_price: 2950, departure_time: '11:30', arrival_time: '14:15' },
  { flight_id: 'AI-805', airline: 'Air India', departure_city: 'Chennai', arrival_city: 'Delhi', base_price: 2800, current_price: 2800, departure_time: '13:00', arrival_time: '15:45' },
  { flight_id: '6E-806', airline: 'Indigo', departure_city: 'Chennai', arrival_city: 'Delhi', base_price: 2700, current_price: 2700, departure_time: '15:30', arrival_time: '18:15' },
  { flight_id: 'SG-807', airline: 'SpiceJet', departure_city: 'Chennai', arrival_city: 'Delhi', base_price: 2550, current_price: 2550, departure_time: '17:00', arrival_time: '19:45' },
  { flight_id: 'UK-808', airline: 'Vistara', departure_city: 'Chennai', arrival_city: 'Delhi', base_price: 3000, current_price: 3000, departure_time: '19:30', arrival_time: '22:15' },
  { flight_id: 'AI-809', airline: 'Air India', departure_city: 'Chennai', arrival_city: 'Delhi', base_price: 2850, current_price: 2850, departure_time: '21:00', arrival_time: '23:45' },
  { flight_id: '6E-810', airline: 'Indigo', departure_city: 'Chennai', arrival_city: 'Delhi', base_price: 2750, current_price: 2750, departure_time: '22:30', arrival_time: '01:15' },

  // Chennai to Mumbai - 10 flights
  { flight_id: 'AI-111', airline: 'Air India', departure_city: 'Chennai', arrival_city: 'Mumbai', base_price: 2450, current_price: 2450, departure_time: '06:00', arrival_time: '07:45' },
  { flight_id: '6E-112', airline: 'Indigo', departure_city: 'Chennai', arrival_city: 'Mumbai', base_price: 2300, current_price: 2300, departure_time: '08:00', arrival_time: '09:45' },
  { flight_id: 'SG-113', airline: 'SpiceJet', departure_city: 'Chennai', arrival_city: 'Mumbai', base_price: 2200, current_price: 2200, departure_time: '10:00', arrival_time: '11:45' },
  { flight_id: 'UK-114', airline: 'Vistara', departure_city: 'Chennai', arrival_city: 'Mumbai', base_price: 2600, current_price: 2600, departure_time: '12:00', arrival_time: '13:45' },
  { flight_id: 'AI-115', airline: 'Air India', departure_city: 'Chennai', arrival_city: 'Mumbai', base_price: 2400, current_price: 2400, departure_time: '14:00', arrival_time: '15:45' },
  { flight_id: '6E-116', airline: 'Indigo', departure_city: 'Chennai', arrival_city: 'Mumbai', base_price: 2350, current_price: 2350, departure_time: '16:00', arrival_time: '17:45' },
  { flight_id: 'SG-117', airline: 'SpiceJet', departure_city: 'Chennai', arrival_city: 'Mumbai', base_price: 2250, current_price: 2250, departure_time: '18:00', arrival_time: '19:45' },
  { flight_id: 'UK-118', airline: 'Vistara', departure_city: 'Chennai', arrival_city: 'Mumbai', base_price: 2650, current_price: 2650, departure_time: '20:00', arrival_time: '21:45' },
  { flight_id: 'AI-119', airline: 'Air India', departure_city: 'Chennai', arrival_city: 'Mumbai', base_price: 2500, current_price: 2500, departure_time: '22:00', arrival_time: '23:45' },
  { flight_id: '6E-120', airline: 'Indigo', departure_city: 'Chennai', arrival_city: 'Mumbai', base_price: 2380, current_price: 2380, departure_time: '23:30', arrival_time: '01:15' },

  // Delhi to Kolkata - 10 flights
  { flight_id: 'SG-801', airline: 'SpiceJet', departure_city: 'Delhi', arrival_city: 'Kolkata', base_price: 2200, current_price: 2200, departure_time: '06:00', arrival_time: '08:15' },
  { flight_id: 'AI-802', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Kolkata', base_price: 2400, current_price: 2400, departure_time: '08:30', arrival_time: '10:45' },
  { flight_id: '6E-803', airline: 'Indigo', departure_city: 'Delhi', arrival_city: 'Kolkata', base_price: 2150, current_price: 2150, departure_time: '10:00', arrival_time: '12:15' },
  { flight_id: 'UK-804', airline: 'Vistara', departure_city: 'Delhi', arrival_city: 'Kolkata', base_price: 2500, current_price: 2500, departure_time: '12:30', arrival_time: '14:45' },
  { flight_id: 'SG-805', airline: 'SpiceJet', departure_city: 'Delhi', arrival_city: 'Kolkata', base_price: 2250, current_price: 2250, departure_time: '14:00', arrival_time: '16:15' },
  { flight_id: 'AI-806', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Kolkata', base_price: 2450, current_price: 2450, departure_time: '16:30', arrival_time: '18:45' },
  { flight_id: '6E-807', airline: 'Indigo', departure_city: 'Delhi', arrival_city: 'Kolkata', base_price: 2180, current_price: 2180, departure_time: '18:00', arrival_time: '20:15' },
  { flight_id: 'UK-808', airline: 'Vistara', departure_city: 'Delhi', arrival_city: 'Kolkata', base_price: 2550, current_price: 2550, departure_time: '20:30', arrival_time: '22:45' },
  { flight_id: 'SG-809', airline: 'SpiceJet', departure_city: 'Delhi', arrival_city: 'Kolkata', base_price: 2300, current_price: 2300, departure_time: '22:00', arrival_time: '00:15' },
  { flight_id: 'AI-810', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Kolkata', base_price: 2350, current_price: 2350, departure_time: '23:30', arrival_time: '01:45' },

  // Kolkata to Mumbai - 10 flights
  { flight_id: 'SG-333', airline: 'SpiceJet', departure_city: 'Kolkata', arrival_city: 'Mumbai', base_price: 2350, current_price: 2350, departure_time: '06:00', arrival_time: '08:30' },
  { flight_id: 'AI-334', airline: 'Air India', departure_city: 'Kolkata', arrival_city: 'Mumbai', base_price: 2550, current_price: 2550, departure_time: '08:30', arrival_time: '11:00' },
  { flight_id: '6E-335', airline: 'Indigo', departure_city: 'Kolkata', arrival_city: 'Mumbai', base_price: 2300, current_price: 2300, departure_time: '10:00', arrival_time: '12:30' },
  { flight_id: 'UK-336', airline: 'Vistara', departure_city: 'Kolkata', arrival_city: 'Mumbai', base_price: 2650, current_price: 2650, departure_time: '12:30', arrival_time: '15:00' },
  { flight_id: 'SG-337', airline: 'SpiceJet', departure_city: 'Kolkata', arrival_city: 'Mumbai', base_price: 2400, current_price: 2400, departure_time: '14:00', arrival_time: '16:30' },
  { flight_id: 'AI-338', airline: 'Air India', departure_city: 'Kolkata', arrival_city: 'Mumbai', base_price: 2600, current_price: 2600, departure_time: '16:30', arrival_time: '19:00' },
  { flight_id: '6E-339', airline: 'Indigo', departure_city: 'Kolkata', arrival_city: 'Mumbai', base_price: 2330, current_price: 2330, departure_time: '18:00', arrival_time: '20:30' },
  { flight_id: 'UK-340', airline: 'Vistara', departure_city: 'Kolkata', arrival_city: 'Mumbai', base_price: 2700, current_price: 2700, departure_time: '20:30', arrival_time: '23:00' },
  { flight_id: 'SG-341', airline: 'SpiceJet', departure_city: 'Kolkata', arrival_city: 'Mumbai', base_price: 2450, current_price: 2450, departure_time: '22:00', arrival_time: '00:30' },
  { flight_id: 'AI-342', airline: 'Air India', departure_city: 'Kolkata', arrival_city: 'Mumbai', base_price: 2500, current_price: 2500, departure_time: '23:30', arrival_time: '02:00' },

  // Chennai to Bangalore - 10 flights
{ flight_id: 'UK-444', airline: 'Vistara', departure_city: 'Chennai', arrival_city: 'Bangalore', base_price: 2150, current_price: 2150, departure_time: '06:00', arrival_time: '07:00' },
{ flight_id: 'AI-445', airline: 'Air India', departure_city: 'Chennai', arrival_city: 'Bangalore', base_price: 2250, current_price: 2250, departure_time: '08:00', arrival_time: '09:00' },
{ flight_id: '6E-446', airline: 'Indigo', departure_city: 'Chennai', arrival_city: 'Bangalore', base_price: 2100, current_price: 2100, departure_time: '10:00', arrival_time: '11:00' },
{ flight_id: 'SG-447', airline: 'SpiceJet', departure_city: 'Chennai', arrival_city: 'Bangalore', base_price: 2050, current_price: 2050, departure_time: '12:00', arrival_time: '13:00' },
{ flight_id: 'UK-448', airline: 'Vistara', departure_city: 'Chennai', arrival_city: 'Bangalore', base_price: 2200, current_price: 2200, departure_time: '14:00', arrival_time: '15:00' },
{ flight_id: 'AI-449', airline: 'Air India', departure_city: 'Chennai', arrival_city: 'Bangalore', base_price: 2180, current_price: 2180, departure_time: '16:00', arrival_time: '17:00' },
{ flight_id: '6E-450', airline: 'Indigo', departure_city: 'Chennai', arrival_city: 'Bangalore', base_price: 2120, current_price: 2120, departure_time: '18:00', arrival_time: '19:00' },
{ flight_id: 'SG-451', airline: 'SpiceJet', departure_city: 'Chennai', arrival_city: 'Bangalore', base_price: 2080, current_price: 2080, departure_time: '20:00', arrival_time: '21:00' },
{ flight_id: 'UK-452', airline: 'Vistara', departure_city: 'Chennai', arrival_city: 'Bangalore', base_price: 2230, current_price: 2230, departure_time: '22:00', arrival_time: '23:00' },
{ flight_id: 'AI-453', airline: 'Air India', departure_city: 'Chennai', arrival_city: 'Bangalore', base_price: 2150, current_price: 2150, departure_time: '23:30', arrival_time: '00:30' },
// Hyderabad to Delhi - 10 flights
{ flight_id: 'AI-555', airline: 'Air India', departure_city: 'Hyderabad', arrival_city: 'Delhi', base_price: 2750, current_price: 2750, departure_time: '05:30', arrival_time: '07:45' },
{ flight_id: '6E-556', airline: 'Indigo', departure_city: 'Hyderabad', arrival_city: 'Delhi', base_price: 2600, current_price: 2600, departure_time: '07:30', arrival_time: '09:45' },
{ flight_id: 'SG-557', airline: 'SpiceJet', departure_city: 'Hyderabad', arrival_city: 'Delhi', base_price: 2500, current_price: 2500, departure_time: '09:30', arrival_time: '11:45' },
{ flight_id: 'UK-558', airline: 'Vistara', departure_city: 'Hyderabad', arrival_city: 'Delhi', base_price: 2850, current_price: 2850, departure_time: '11:30', arrival_time: '13:45' },
{ flight_id: 'AI-559', airline: 'Air India', departure_city: 'Hyderabad', arrival_city: 'Delhi', base_price: 2700, current_price: 2700, departure_time: '13:30', arrival_time: '15:45' },
{ flight_id: '6E-560', airline: 'Indigo', departure_city: 'Hyderabad', arrival_city: 'Delhi', base_price: 2650, current_price: 2650, departure_time: '15:30', arrival_time: '17:45' },
{ flight_id: 'SG-561', airline: 'SpiceJet', departure_city: 'Hyderabad', arrival_city: 'Delhi', base_price: 2550, current_price: 2550, departure_time: '17:30', arrival_time: '19:45' },
{ flight_id: 'UK-562', airline: 'Vistara', departure_city: 'Hyderabad', arrival_city: 'Delhi', base_price: 2900, current_price: 2900, departure_time: '19:30', arrival_time: '21:45' },
{ flight_id: 'AI-563', airline: 'Air India', departure_city: 'Hyderabad', arrival_city: 'Delhi', base_price: 2800, current_price: 2800, departure_time: '21:30', arrival_time: '23:45' },
{ flight_id: '6E-564', airline: 'Indigo', departure_city: 'Hyderabad', arrival_city: 'Delhi', base_price: 2680, current_price: 2680, departure_time: '23:00', arrival_time: '01:15' }
];
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flight-booking')
.then(async () => {
console.log('✅ Connected to MongoDB');
await Flight.deleteMany({});
console.log('🗑️  Cleared existing flights');

await Flight.insertMany(flights);
console.log(`✅ Seeded ${flights.length} flights`);
console.log('\n📊 Flight Distribution:');

// Count flights per route
const routes = {};
flights.forEach(f => {
  const route = `${f.departure_city} → ${f.arrival_city}`;
  routes[route] = (routes[route] || 0) + 1;
});

Object.entries(routes).forEach(([route, count]) => {
  console.log(`   ${route}: ${count} flights`);
});

console.log(`\n✈️  Total: ${flights.length} flights across ${Object.keys(routes).length} routes`);

process.exit(0);
})
.catch(err => {
console.error('❌ Error:', err);
process.exit(1);
});