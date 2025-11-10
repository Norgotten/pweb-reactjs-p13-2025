// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // <-- Pastikan ini diimpor
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext' // <-- 1. Import CartProvider
import { ToastProvider } from './contexts/ToastContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. Bungkus App dengan CartProvider */}
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
)