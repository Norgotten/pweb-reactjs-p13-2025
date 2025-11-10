// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

// 1. Definisikan props yang akan diterima
interface HomePageProps {
  isLoggedIn: boolean;
}

// 2. Terima props isLoggedIn
const HomePage: React.FC<HomePageProps> = ({ isLoggedIn }) => {
  return (
    <div className="w-full">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-dark-text">
            Welcome to IT Literature Shop.
          </h1>
          <p className="mt-4 text-lg text-light-text max-w-2xl mx-auto">
            Temukan berbagai buku teknologi, pemrograman, dan inovasi digital dari penerbit terbaik di dunia.
          </p>

          {/* === PERUBAHAN DI SINI === */}
          {/* Hapus Search Bar, ganti dengan logika CTA */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            {isLoggedIn ? (
              // JIKA SUDAH LOGIN: Tampilkan tombol CTA "Find Book!"
              <Link 
                to="/books" // Arahkan ke halaman daftar buku
                // Style diambil dari tombol "Register" di Header.tsx
                className="w-full sm:w-auto bg-brand-color text-white font-semibold py-3 px-10 rounded-md hover:opacity-90 transition-opacity text-lg"
              >
                Find Book!
              </Link>
            ) : (
              // JIKA BELUM LOGIN: Tampilkan tombol Login & Register
              <>
                <Link 
                  to="/login" 
                  // Style diambil dari tombol "Register" di Header.tsx
                  className="w-full sm:w-auto bg-brand-color text-white font-semibold py-3 px-10 rounded-md hover:opacity-90 transition-opacity text-lg"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  // Style diambil dari tombol "Search" di HomePage lama
                  className="w-full sm:w-auto bg-gray-800 text-white font-semibold py-3 px-10 rounded-md hover:bg-gray-700 transition-opacity text-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          {/* === AKHIR PERUBAHAN === */}

        </div>
      </section>

      {/* 2. FEATURES SECTION (Tidak berubah) */}
      <section className="bg-secondary-bg py-20">
        {/* ... (isi features tidak berubah) ... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <span className="text-5xl">🕒</span>
            <h4 className="mt-4 text-xl font-semibold">Quick Delivery</h4>
            <p className="mt-2 text-sm text-light-text">Pesananmu diproses dan dikirim dengan cepat, sehingga kamu bisa segera menikmati buku favoritmu.</p>
          </div>
          <div className="text-center">
            <span className="text-5xl">🛡️</span>
            <h4 className="mt-4 text-xl font-semibold">Secure Payment</h4>
            <p className="mt-2 text-sm text-light-text">Transaksi dijamin aman dengan sistem pembayaran terenkripsi dan metode terpercaya.</p>
          </div>
          <div className="text-center">
            <span className="text-5xl">🏆</span>
            <h4 className="mt-4 text-xl font-semibold">Best Quality</h4>
            <p className="mt-2 text-sm text-light-text">Kami hanya menyediakan buku berkualitas dari penulis dan penerbit ternama di bidang teknologi.</p>
          </div>
          <div className="text-center">
            <span className="text-5xl">🔄</span>
            <h4 className="mt-4 text-xl font-semibold">Return Guarantee</h4>
            <p className="mt-2 text-sm text-light-text">Jika ada masalah dengan produk, kami siap menerima pengembalian dengan proses yang mudah dan cepat.</p>
          </div>
        </div>
      </section>

      {/* 3. CTA SECTION (Tidak berubah) */}
      <section className="bg-[#a98e76] py-20">
        {/* ... (isi cta tidak berubah) ... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-white">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold">GET ALL YOUR BOOKS</h2>
            <h2 className="text-4xl font-Nbold">IN THIS LIBRARY!</h2>
          </div>
          <Link to="/books" className="mt-6 md:mt-0 bg-white text-dark-text font-semibold uppercase py-3 px-10 rounded-md hover:bg-gray-100 transition-colors">
            Booklist
          </Link>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;