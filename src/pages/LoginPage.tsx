// src/components/LoginPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod'; // 1. Import Zod

// 2. Buat skema validasi
const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

const LoginPage = () => {
  // 3. Siapkan state untuk input form 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State untuk menangani error dari API atau validasi
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Hook untuk navigasi/redirect setelah login
  const navigate = useNavigate();

  // 4. Buat fungsi handleSubmit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Mencegah form me-refresh halaman 
    setError(null); // Reset error setiap kali submit

    // 5. Validasi input menggunakan Zod
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      // Jika validasi gagal, tampilkan error pertama
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      // 6. Kirim data ke API backend (Modul 3)
      // GANTI URL INI JIKA PERLU
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: email, // atau validation.data.email
        password: password, // atau validation.data.password
      });

      // 7. Simpan token ke localStorage 
      // Asumsi backend mengembalikan token di response.data.token
      const token = response.data.data.access_token; // <-- NAMA YANG BENAR
      if (token) {
        localStorage.setItem('authToken', token);
        
        // 8. Arahkan ke halaman utama (daftar buku) 
        navigate('/');
      } else {
        setError('Login berhasil, namun tidak menerima token.');
      }

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Tangkap error dari server (misal: "Password salah")
        setError(err.response.data.message || 'Login gagal');
      } else {
        setError('Terjadi kesalahan. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 9. Buat elemen form (UI)
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 
            placeholder="Masukkan email"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
          />
        </div>

        {/* Tampilkan pesan error jika ada */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;