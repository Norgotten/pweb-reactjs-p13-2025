// src/config/api.ts
import axios from 'axios';

// Base URL API
export const API_BASE_URL = 'http://localhost:3000';

// Axios instance dengan interceptor
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk menambahkan token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika token expired atau unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  
  // Books
  BOOKS: '/books',
  BOOK_BY_ID: (id: string) => `/books/${id}`,
  BOOKS_BY_GENRE: (genreId: string) => `/books/genre/${genreId}`,
  
  // Genres
  GENRES: '/genre', // Backend uses /genre, not /genres
  GENRE_BY_ID: (id: string) => `/genre/${id}`,
  
  // Transactions
  TRANSACTIONS: '/transactions',
  TRANSACTION_BY_ID: (id: string) => `/transactions/${id}`,
  TRANSACTION_STATS: '/transactions/statistics',
};