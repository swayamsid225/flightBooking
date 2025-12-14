import React, { useState, useEffect } from 'react';
import { Download, Plane, Calendar, CreditCard, History as HistoryIcon } from 'lucide-react';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

const HistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load bookings');
      console.error('Fetch bookings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async (bookingId, pnr) => {
    try {
      setDownloadingId(bookingId);
      
      const response = await api.get(`/bookings/${bookingId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${pnr}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download ticket. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your bookings..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={fetchBookings}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <HistoryIcon className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Bookings Yet</h3>
          <p className="text-gray-500 mb-6">
            You haven't made any flight bookings. Start exploring and book your first flight!
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Search Flights
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Bookings</h2>
        <p className="text-gray-600 mt-1">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {bookings.map((booking) => {
          const flight = booking.flight || booking.flight_details;
          const bookingDate = new Date(booking.createdAt);
          
          return (
            <div key={booking._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Booking Info */}
                <div className="flex-1 space-y-4">
                  {/* PNR and Date */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-1.5 rounded-full">
                      PNR: {booking.pnr}
                    </span>
                    <span className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      {bookingDate.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} at {bookingDate.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Flight Details */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {flight.airline || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-500">{flight.flight_id || 'N/A'}</p>
                  </div>

                  {/* Route */}
                  <div className="flex items-center space-x-4 text-gray-700">
                    <div className="text-center">
                      <span className="font-semibold text-lg block">{flight.departure_city || 'N/A'}</span>
                      {flight.departure_time && (
                        <span className="text-xs text-gray-500">{flight.departure_time}</span>
                      )}
                    </div>
                    <div className="flex items-center flex-1 max-w-xs">
                      <div className="h-0.5 bg-gray-300 flex-1"></div>
                      <Plane className="h-4 w-4 mx-2 text-gray-400 transform rotate-90" />
                      <div className="h-0.5 bg-gray-300 flex-1"></div>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-lg block">{flight.arrival_city || 'N/A'}</span>
                      {flight.arrival_time && (
                        <span className="text-xs text-gray-500">{flight.arrival_time}</span>
                      )}
                    </div>
                  </div>

                  {/* Amount Paid */}
                  <div className="flex items-center space-x-2 bg-green-50 inline-block px-4 py-2 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700 font-medium">Amount Paid:</span>
                    <span className="text-2xl font-bold text-green-700">
                      ₹{booking.amount_paid.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex lg:flex-col justify-center items-center gap-3 lg:border-l lg:pl-6">
                  <button
                    onClick={() => handleDownloadTicket(booking._id, booking.pnr)}
                    disabled={downloadingId === booking._id}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {downloadingId === booking._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Download Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPage;