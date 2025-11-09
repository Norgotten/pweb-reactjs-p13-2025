// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      // 1. Kirim data login
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: email,
        password: password,
      });
      
      const token = response.data.data.access_token;
      if (token) {
        // 2. Simpan token
        localStorage.setItem('authToken', token);

        // 3. (BARU) Ambil data user untuk mendapatkan nama
        try {
          const userResponse = await axios.get('http://localhost:3000/auth/me', {
             headers: { Authorization: `Bearer ${token}` }
          });
          // Asumsi responsenya adalah { ..., username: 'John' }
          localStorage.setItem('username', userResponse.data.username);
        } catch (userErr) {
          console.error("Login berhasil, tapi gagal mengambil data user", userErr);
          localStorage.setItem('username', 'User'); // Fallback
        }
        
        // 4. Arahkan ke halaman utama
        navigate('/');
      } else {
        setError('Login berhasil, namun tidak menerima token.');
      }

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Login gagal');
      } else {
        setError('Terjadi kesalahan. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-card-bg border border-border-color rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold text-center text-dark-text mb-8">
        Login
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-dark-text mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email"
            className="w-full px-4 py-3 border border-border-color rounded-md bg-secondary-bg focus:outline-none focus:ring-2 focus:ring-brand-color focus:bg-white"
          />
        </div>
        
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-dark-text mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            className="w-full px-4 py-3 border border-border-color rounded-md bg-secondary-bg focus:outline-none focus:ring-2 focus:ring-brand-color focus:bg-white"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-brand-color text-white font-semibold py-3 rounded-md uppercase hover:opacity-90 transition-opacity disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>

      <p className="text-center text-sm text-light-text mt-6">
        Belum punya akun?{' '}
        <Link to="/register" className="font-medium text-brand-color hover:underline">
          Register di sini
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;