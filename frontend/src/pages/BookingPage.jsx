import React, { useState } from 'react';
import { Plane, Wallet, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingPage = ({ flight, onComplete, onCancel }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!flight) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Flight Selected</h3>
          <p className="text-gray-500 mb-6">Please select a flight to continue</p>
          <button
            onClick={onCancel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('📤 Sending booking request for flight:', flight._id);

      const response = await api.post('/bookings', {
        flightId: flight._id
      });

      console.log('✅ Booking response:', response.data);

      const userResponse = await api.get('/users/profile');
      updateUser(userResponse.data);

      if (response.data.booking?._id) {
        try {
          const ticketResponse = await api.get(
            `/bookings/${response.data.booking._id}/download`,
            { responseType: 'blob' }
          );
          
          const url = window.URL.createObjectURL(new Blob([ticketResponse.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `ticket-${response.data.booking.pnr}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch (downloadError) {
          console.error('Download error:', downloadError);
        }
      }

      onComplete();
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const canAfford = user?.wallet_balance >= flight.current_price;
  const balanceAfterBooking = user?.wallet_balance - flight.current_price;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h2 className="text-3xl font-bold text-white">Confirm Your Booking</h2>
          <p className="text-blue-100 mt-1">Review your flight details before payment</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Plane className="h-5 w-5 mr-2 text-blue-600" />
              Flight Details
            </h3>
            <div className="space-y-3 ml-7">
              <div className="flex justify-between">
                <span className="text-gray-600">Airline:</span>
                <span className="font-semibold text-gray-800">{flight.airline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Flight Number:</span>
                <span className="font-semibold text-gray-800">{flight.flight_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-semibold text-gray-800">
                  {flight.departure_city} → {flight.arrival_city}
                </span>
              </div>
              {flight.departure_time && flight.arrival_time && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure:</span>
                    <span className="font-semibold text-gray-800">{flight.departure_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrival:</span>
                    <span className="font-semibold text-gray-800">{flight.arrival_time}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Passenger Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-semibold text-gray-800">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold text-gray-800">{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Flight Price:</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-800">
                    ₹{flight.current_price.toLocaleString()}
                  </span>
                  {flight.current_price > flight.base_price && (
                    <p className="text-sm text-gray-500 line-through">
                      ₹{flight.base_price.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {flight.surge_active && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <TrendingUp className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">
                    <span className="font-semibold">Surge Pricing Active:</span>
                    <span className="ml-1">Price increased 10% due to high demand</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-blue-200 pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Current Wallet Balance:
                </span>
                <span className="text-lg font-semibold text-green-600">
                  ₹{user?.wallet_balance.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Balance After Booking:</span>
                <span className={`text-lg font-semibold ${
                  canAfford ? 'text-gray-800' : 'text-red-600'
                }`}>
                  ₹{balanceAfterBooking.toLocaleString()}
                </span>
              </div>
            </div>

            {!canAfford && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <span className="font-semibold">Insufficient Balance:</span>
                  <span className="ml-1">
                    You need ₹{(flight.current_price - user?.wallet_balance).toLocaleString()} more to book this flight
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={loading || !canAfford}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Confirm & Pay ₹{flight.current_price.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;