import React, { useState } from 'react';
import { Plane, Wallet, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const navigate = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('home')}
          >
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">SkyBook</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => navigate('home')}
              className={`font-medium transition-colors ${
                currentPage === 'home' || currentPage === 'results' || currentPage === 'booking'
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Search Flights
            </button>
            
            <button 
              onClick={() => navigate('history')}
              className={`font-medium transition-colors ${
                currentPage === 'history' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              My Bookings
            </button>
            
            <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
              <Wallet className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">
                ₹{user?.wallet_balance?.toLocaleString() || '0'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 border-l pl-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">{user?.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t mt-2 pt-4">
            <button
              onClick={() => navigate('home')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Search Flights
            </button>
            
            <button
              onClick={() => navigate('history')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              My Bookings
            </button>
            
            <div className="px-4 py-2 bg-green-100 rounded mx-4">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">
                  Wallet: ₹{user?.wallet_balance?.toLocaleString() || '0'}
                </span>
              </div>
            </div>
            
            <div className="px-4 py-2 mx-4">
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">{user?.name}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded mx-4"
            >
              <div className="flex items-center space-x-2">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;