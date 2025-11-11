// src/App.tsx - FIXED & ENHANCED
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import BookDetailsPage from './pages/BookDetailsPage';
import TransactionPage from './pages/TransactionPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/Header';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // Full-width pages (no container)
  const fullWidthPaths = ['/', '/login', '/register'];
  const isFullWidth = fullWidthPaths.includes(location.pathname);

  const mainClassName = isFullWidth
    ? ""
    : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";

  return (
    <div className="min-h-screen bg-primary-bg">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <main className={mainClassName}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - Books */}
          <Route
            path="/books"
            element={<ProtectedRoute><BooksPage /></ProtectedRoute>}
          />
          <Route
            path="/books/add"
            element={<ProtectedRoute><AddBookPage /></ProtectedRoute>}
          />
          <Route
            path="/books/:bookId"
            element={<ProtectedRoute><BookDetailsPage /></ProtectedRoute>}
          />
          <Route
            path="/books/:bookId/edit"
            element={<ProtectedRoute><EditBookPage /></ProtectedRoute>}
          />

          {/* Protected Routes - Transactions */}
          <Route
            path="/transactions"
            element={<ProtectedRoute><TransactionPage /></ProtectedRoute>}
          />
          <Route
            path="/transactions/history"
            element={<ProtectedRoute><TransactionHistoryPage /></ProtectedRoute>}
          />
          <Route
            path="/transactions/:transactionId"
            element={<ProtectedRoute><TransactionDetailPage /></ProtectedRoute>}
          />

          {/* 404 Not Found */}
          <Route path="*" element={
            <div className="text-center py-20">
              <h1 className="text-6xl font-bold text-dark-text mb-4">404</h1>
              <p className="text-xl text-light-text mb-8">Page not found</p>
              <a href="/" className="text-brand-color font-medium hover:underline">
                Go back home
              </a>
            </div>
          } />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-card-bg border-t border-border-color mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-light-text text-sm">
            <p>&copy; 2025 IT Literature Shop. All rights reserved.</p>
            <p className="mt-2">Built with React + TypeScript + Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;