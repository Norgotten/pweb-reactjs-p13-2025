// src/components/Header.tsx - Fixed Username Display
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { apiClient, API_ENDPOINTS } from '../config/api';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  const { itemCount } = useCart();
  const [username, setUsername] = useState<string>('User');

  useEffect(() => {
    const fetchUsername = async () => {
      if (isLoggedIn) {
        try {
          const response = await apiClient.get(API_ENDPOINTS.ME);
          const fetchedUsername = response.data.username || response.data.data?.username || 'User';
          setUsername(fetchedUsername);
          localStorage.setItem('username', fetchedUsername);
        } catch (err) {
          console.error('Failed to fetch username:', err);
          const stored = localStorage.getItem('username');
          setUsername(stored || 'User');
        }
      }
    };

    fetchUsername();
  }, [isLoggedIn]);

  return (
    <header className="bg-card-bg shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-dark-text hover:text-brand-color transition-colors">
            IT Lit Shop
          </Link>

          {/* Navigasi Tengah */}
          <div className="hidden sm:flex sm:gap-x-6">
            {isLoggedIn && (
              <>
                <Link to="/" className="text-sm font-medium text-light-text hover:text-dark-text transition-colors">
                  Home
                </Link>
                <Link to="/books" className="text-sm font-medium text-light-text hover:text-dark-text transition-colors">
                  Books
                </Link>
                <Link to="/transactions/history" className="text-sm font-medium text-light-text hover:text-dark-text transition-colors">
                  History
                </Link>
              </>
            )}
          </div>

          {/* Aksi Kanan */}
          <div className="flex items-center gap-x-4">
            {isLoggedIn ? (
              <>
                {/* Keranjang */}
                <Link to="/transactions" className="relative p-1 text-dark-text hover:text-brand-color transition-colors">
                  <span className="text-2xl">🛒</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-brand-color text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="flex items-center gap-x-2 border border-border-color rounded-full py-1.5 px-3 hover:bg-secondary-bg transition-colors">
                  <span className="text-xl">👤</span>
                  <span className="text-sm font-medium text-dark-text">
                    {username}
                  </span>
                </div>
                
                <button
                  onClick={onLogout}
                  className="text-sm font-medium text-light-text hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-dark-text hover:text-brand-color transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm font-medium bg-brand-color text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;