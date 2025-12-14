import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Filter } from 'lucide-react';
import api from '../api/api';
import FlightCard from '../components/FlightCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResultsPage = ({ searchParams, onBookFlight }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price');
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams) {
      searchFlights();
    }
  }, [searchParams]);

  const searchFlights = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/flights/search', {
        params: {
          from: searchParams.from,
          to: searchParams.to
        }
      });
      
      setFlights(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search flights');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === 'price') {
      return a.current_price - b.current_price;
    } else if (sortBy === 'airline') {
      return a.airline.localeCompare(b.airline);
    }
    return 0;
  });

  if (loading) {
    return <LoadingSpinner message="Searching flights..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={searchFlights}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Flights Found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any flights for {searchParams.from} to {searchParams.to}
          </p>
          <p className="text-sm text-gray-500">Try searching for different cities</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {searchParams.from} → {searchParams.to}
          </h2>
          <p className="text-gray-600 mt-1">{flights.length} flights available</p>
        </div>
        
        {/* Sort Controls */}
        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-md">
          <ArrowUpDown className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none focus:ring-0 font-medium text-gray-800 cursor-pointer"
          >
            <option value="price">Price (Low to High)</option>
            <option value="airline">Airline (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Surge Warning */}
      {sortedFlights.some(f => f.surge_active) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">⚠️ Dynamic Pricing Alert:</span> Some flights are experiencing high demand. 
            Prices have increased by 10% and will reset automatically in a few minutes.
          </p>
        </div>
      )}

      {/* Flight Cards */}
      <div className="grid gap-4">
        {sortedFlights.map((flight) => (
          <FlightCard
            key={flight._id}
            flight={flight}
            onBook={onBookFlight}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;