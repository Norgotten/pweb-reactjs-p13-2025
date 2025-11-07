// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';

// Ini adalah 'props' khusus yang mengambil komponen lain sebagai 'anak'-nya
interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // 1. Cek apakah token ada di localStorage
  const token = localStorage.getItem('authToken');

  if (!token) {
    // 2. Jika tidak ada token, redirect ke halaman /login
    // 'replace' berarti user tidak bisa menekan tombol 'back' untuk kembali
    return <Navigate to="/login" replace />;
  }

  // 3. Jika ada token, tampilkan halaman yang diminta (children)
  return children;
};

export default ProtectedRoute;