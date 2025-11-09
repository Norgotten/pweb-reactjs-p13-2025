// src/App.tsx
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import BooksPage from './pages/BooksPage'; // <-- Path baru
import LoginPage from './pages/LoginPage'; // <-- Path baru
import RegisterPage from './pages/RegisterPage'; // <-- Path baru
import ProtectedRoute from './components/common/ProtectedRoute'; // <-- Path baru
import Header from './components/Header'; // <-- Komponen Header baru
import HomePage from './pages/HomePage'; // <-- Halaman baru
import TransactionPage from './pages/TransactionPage'; // <-- Halaman baru
import BookDetailsPage from './pages/BookDetailsPage'; // <-- Halaman baru

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Cek status login
  const isLoggedIn = !!localStorage.getItem('authToken');

  // Buat fungsi logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username'); // <-- PENTING: Hapus juga username
    navigate('/login'); // Arahkan ke login
  };

  // Tentukan halaman mana yang full-width
  const fullWidthPaths = ['/', '/login', '/register'];
  const isFullWidth = fullWidthPaths.includes(location.pathname);

  // Terapkan layout Tailwind:
  // Jika full-width, tidak ada class.
  // Jika tidak, terapkan .app-main (max-w-7xl, mx-auto, dll)
  const mainClassName = isFullWidth
    ? ""
    : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"; // 1280px, padding, dan center

  return (
    <div>
      {/* Kirim props ke Header */}
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <main className={mainClassName}>
        <Routes>
          {/* Rute Full-width */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rute Terbungkus (dilindungi) */}
          <Route
            path="/books"
            element={<ProtectedRoute><BooksPage /></ProtectedRoute>}
          />
          <Route
            path="/books/:bookId"
            element={<ProtectedRoute><BookDetailsPage /></ProtectedRoute>}
          />
          <Route
            path="/transactions"
            element={<ProtectedRoute><TransactionPage /></ProtectedRoute>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;