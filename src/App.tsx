// src/App.tsx
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; // <-- 1. Tambah useNavigate
import BookList from './components/BookList';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navigate = useNavigate(); // <-- 2. Inisialisasi navigate
  
  // Cek status login (sederhana)
  const isLoggedIn = !!localStorage.getItem('authToken');

  // 3. Buat fungsi logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Hapus token 
    navigate('/login'); // Arahkan ke login
  };

  return (
    <div>
      <nav>
        {/* 4. Tampilkan link secara kondisional */}
        {isLoggedIn ? (
          <>
            <Link to="/">Daftar Buku</Link> | 
            {/* Tambahkan link Transaksi nanti */}
            {/* <Link to="/transactions">Transaksi</Link> | */}
            <button onClick={handleLogout}>Logout</button> 
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | 
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      
      {/* Tampilkan email user jika login (Sesuai soal [cite: 689]) */}
      {/* Kita akan implementasi ini setelah punya endpoint /me */}
      
      <hr />
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <BookList />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;