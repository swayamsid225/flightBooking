import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const HomePage = ({ onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');
    
    if (!from.trim()) {
      setError('Please enter departure city');
      return;
    }
    
    if (!to.trim()) {
      setError('Please enter arrival city');
      return;
    }

    onSearch({ from: from.trim(), to: to.trim() });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Find Your Perfect Flight
          </h1>
          <p className="text-gray-600 text-lg">
            Search from thousands of destinations worldwide
          </p>
        </div>
        
        {/* Search Form */}
        <div className="space-y-6">
          {/* From Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Delhi"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          {/* To Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Mumbai"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Search Flights</span>
          </button>
        </div>

        {/* Popular Routes */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Routes:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { from: 'Delhi', to: 'Mumbai' },
              { from: 'Mumbai', to: 'Bangalore' },
              { from: 'Delhi', to: 'Bangalore' },
              { from: 'Chennai', to: 'Mumbai' }
            ].map((route, index) => (
              <button
                key={index}
                onClick={() => {
                  setFrom(route.from);
                  setTo(route.to);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
              >
                {route.from} → {route.to}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-blue-600 text-3xl mb-2">⚡</div>
          <h3 className="font-semibold text-gray-800 mb-1">Instant Booking</h3>
          <p className="text-sm text-gray-600">Book your flights in seconds with our streamlined process</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-green-600 text-3xl mb-2">💳</div>
          <h3 className="font-semibold text-gray-800 mb-1">Wallet Payment</h3>
          <p className="text-sm text-gray-600">Fast and secure payments from your wallet balance</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-purple-600 text-3xl mb-2">🎫</div>
          <h3 className="font-semibold text-gray-800 mb-1">Digital Tickets</h3>
          <p className="text-sm text-gray-600">Download your tickets instantly after booking</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;