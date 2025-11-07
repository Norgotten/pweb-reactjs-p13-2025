// src/components/RegisterPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

// 1. Buat skema validasi Zod
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

const RegisterPage = () => {
  // 2. Siapkan state untuk setiap input
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 3. Buat fungsi handleSubmit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // 4. Validasi input
    const validation = registerSchema.safeParse({ username, email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      // 5. Kirim data ke API backend
      // Endpoint berdasarkan file authRoutes.ts Anda
      await axios.post('http://localhost:3000/auth/register', {
        username: username,
        email: email,
        password: password,
      });

      // 6. Jika berhasil, arahkan ke halaman Login
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Tangkap error dari server (misal: "Email sudah terdaftar")
        setError(err.response.data.message || 'Registrasi gagal');
      } else {
        setError('Terjadi kesalahan. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 7. Buat elemen form (UI)
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nama:</label>
          <input
            id="name"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan nama"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;