import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import TransactionPage from './pages/TransactionPage';
import BookDetailsPage from './pages/BookDetailsPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import TransactionDetailPage from './pages/TransactionDetailPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // Full-width pages
  const fullWidthPaths = ['/', '/login', '/register'];
  const isFullWidth = fullWidthPaths.includes(location.pathname);

  const mainClassName = isFullWidth
    ? ""
    : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";

  return (
    <div>
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
        </Routes>
      </main>
    </div>
  );
}

export default App;