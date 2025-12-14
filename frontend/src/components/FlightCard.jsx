import React from 'react';
import { Plane, TrendingUp, Clock } from 'lucide-react';

const FlightCard = ({ flight, onBook }) => {
  const timeRemaining = flight.surge_active && flight.surge_end_time
    ? Math.max(0, Math.floor((new Date(flight.surge_end_time) - new Date()) / 60000))
    : 0;

  // Calculate flight duration
  const calculateDuration = (depTime, arrTime) => {
    const [depHour, depMin] = depTime.split(':').map(Number);
    const [arrHour, arrMin] = arrTime.split(':').map(Number);
    
    let durationMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
    
    // Handle overnight flights
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60;
    }
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Flight Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{flight.airline}</h3>
              <p className="text-sm text-gray-500">{flight.flight_id}</p>
            </div>
          </div>
          
          {/* Route */}
          <div className="flex items-center space-x-4 text-gray-700">
            <div className="text-center">
              <span className="font-semibold text-lg block">{flight.departure_city}</span>
              <span className="text-sm text-gray-500">{flight.departure_time}</span>
            </div>
            <div className="flex-1 flex flex-col items-center max-w-xs">
              <div className="flex items-center w-full">
                <div className="h-0.5 bg-gray-300 flex-1"></div>
                <Plane className="h-4 w-4 mx-2 text-gray-400 transform rotate-90" />
                <div className="h-0.5 bg-gray-300 flex-1"></div>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {calculateDuration(flight.departure_time, flight.arrival_time)}
              </span>
            </div>
            <div className="text-center">
              <span className="font-semibold text-lg block">{flight.arrival_city}</span>
              <span className="text-sm text-gray-500">{flight.arrival_time}</span>
            </div>
          </div>
        </div>

        {/* Price and Booking */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <div className="text-right">
            <div className="flex items-center space-x-2 justify-end">
              <span className="text-3xl font-bold text-gray-800">
                ₹{flight.current_price.toLocaleString()}
              </span>
              {flight.surge_active && (
                <div className="bg-red-100 p-1 rounded">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                </div>
              )}
            </div>
            
            {flight.current_price > flight.base_price && (
              <p className="text-sm text-gray-500 line-through">
                ₹{flight.base_price.toLocaleString()}
              </p>
            )}
            
            {flight.surge_active && timeRemaining > 0 && (
              <div className="flex items-center space-x-1 text-xs text-red-600 mt-1">
                <Clock className="h-3 w-3" />
                <span>Resets in {timeRemaining}m</span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => onBook(flight)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Surge Warning Banner */}
      {flight.surge_active && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="font-medium">High Demand:</span>
            <span className="ml-1">Price increased by 10% due to multiple booking attempts</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default FlightCard;