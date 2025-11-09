// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

// Terima props dari App.tsx
interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  const { itemCount } = useCart();
  
  // Ambil username dari localStorage (diatur saat login)
  const username = localStorage.getItem('username');

  return (
    <header className="bg-card-bg shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-dark-text">
            IT Lit Shop
          </Link>

          {/* Navigasi Tengah (Hanya jika sudah login) */}
          <div className="hidden sm:flex sm:gap-x-6">
            {isLoggedIn && (
              <>
                <Link to="/" className="text-sm font-medium text-light-text hover:text-dark-text">
                  Home
                </Link>
                <Link to="/books" className="text-sm font-medium text-light-text hover:text-dark-text">
                  Books
                </Link>
                <Link to="/transactions" className="text-sm font-medium text-light-text hover:text-dark-text">
                  Transaction
                </Link>
              </>
            )}
          </div>

          {/* Aksi Kanan (Login/Register atau User/Cart) */}
          <div className="flex items-center gap-x-4">
            {isLoggedIn ? (
              <>
                {/* Keranjang Belanja */}
                <Link to="/transactions" className="relative p-1 text-dark-text">
                  <span className="text-2xl">🛒</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-brand-color text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* Menu User */}
                <div className="flex items-center gap-x-2 border border-border-color rounded-full py-1.5 px-3">
                  <span className="text-xl">👤</span>
                  <span className="text-sm font-medium text-dark-text">
                    {username || 'User'} {/* Tampilkan nama dinamis */}
                  </span>
                </div>
                
                <button
                  onClick={onLogout}
                  className="text-sm font-medium text-light-text hover:text-dark-text"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Link Login/Register */}
                <Link to="/login" className="text-sm font-medium text-dark-text hover:text-brand-color">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium text-dark-text hover:text-brand-color">
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