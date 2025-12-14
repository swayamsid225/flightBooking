import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import BookingPage from './pages/BookingPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [searchParams, setSearchParams] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return currentPage === 'register' ? (
      <RegisterPage onSwitchToLogin={() => setCurrentPage('login')} />
    ) : (
      <LoginPage onSwitchToRegister={() => setCurrentPage('register')} />
    );
  }

  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage('results');
  };

  const handleBookFlight = (flight) => {
    setSelectedFlight(flight);
    setCurrentPage('booking');
  };

  const handleBookingComplete = () => {
    setCurrentPage('history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && <HomePage onSearch={handleSearch} />}
        
        {currentPage === 'results' && (
          <SearchResultsPage 
            searchParams={searchParams} 
            onBookFlight={handleBookFlight}
          />
        )}
        
        {currentPage === 'booking' && (
          <BookingPage 
            flight={selectedFlight}
            onComplete={handleBookingComplete}
            onCancel={() => setCurrentPage('results')}
          />
        )}
        
        {currentPage === 'history' && <HistoryPage />}
      </main>

      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2025 SkyBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;