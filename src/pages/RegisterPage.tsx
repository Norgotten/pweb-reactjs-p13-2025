// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const validation = registerSchema.safeParse({ username, email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3000/auth/register', {
        username: username,
        email: email,
        password: password,
      });

      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Registrasi gagal');
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
        Register
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-2">
            Nama
          </label>
          <input
            id="name"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan nama"
            className="w-full px-4 py-3 border border-border-color rounded-md bg-secondary-bg focus:outline-none focus:ring-2 focus:ring-brand-color focus:bg-white"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">
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
          <label htmlFor="password" className="block text-sm font-medium text-dark-text mb-2">
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
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>

      <p className="text-center text-sm text-light-text mt-6">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-medium text-brand-color hover:underline">
          Login di sini
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;