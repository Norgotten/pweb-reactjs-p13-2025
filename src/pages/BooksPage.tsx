// src/components/BookList.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // [cite: 580]

// 1. Definisikan 'tipe' data untuk buku, sesuai dengan TypeScript
// Sesuaikan ini dengan data dari API Anda
interface Book {
  id: string; // ID-nya adalah string (UUID)
  title: string;
  writer: string;
  price: string; // Price adalah string di API Anda ("50000")
  stock_quantity: number; // <-- NAMA YANG BENAR
  description: string;
  genre: string;
}

const BookList: React.FC = () => {
  // 2. Siapkan state untuk data, loading, dan error [cite: 409]
  const [books, setBooks] = useState<Book[]>([]); // State untuk menyimpan array buku
  const [loading, setLoading] = useState(true); // State untuk loading [cite: 503]
  const [error, setError] = useState<string | null>(null); // State untuk error

  // 3. Gunakan useEffect untuk fetch data saat komponen dimuat [cite: 432]
  useEffect(() => {
    // Buat fungsi async di dalam useEffect untuk fetch data [cite: 505, 565]
    const fetchBooks = async () => {
      // Gunakan try...catch...finally untuk penanganan error & loading [cite: 547-553]
      try {
        // GANTI URL INI dengan URL API Anda
        const response = await axios.get('http://localhost:3000/books');

        console.log("Data buku dari API:", response.data.data);
        
        setBooks(response.data.data); // Simpan data ke state [cite: 567]
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message); // [cite: 569, 570]
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false); // Hentikan loading, baik sukses maupun gagal [cite: 515, 572]
      }
    };

    fetchBooks(); // Panggil fungsi fetch
  }, []); // [] dependency array kosong berarti efek ini hanya berjalan sekali [cite: 471]

  // 4. Conditional Rendering sesuai state [cite: 43]
  if (loading) {
    return <p>Loading books...</p>; // Tampilkan loading state
  }

  if (error) {
    return <p>Error fetching data: {error}</p>; // Tampilkan error state
  }
  
  if (books.length === 0) {
    return <p>No books found.</p>; // Tampilkan empty state
  }

  // 5. Render list jika data berhasil didapat [cite: 345]
  return (
    <div>
      <h1>IT Literature Shop</h1>
      <ul>
        {/* Gunakan .map() untuk me-render list [cite: 347, 364] */}
        {books.map((book) => (
          // 'key' wajib ada dan harus unik untuk setiap item list [cite: 403, 404]
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.writer} - (Stock: {book.stock_quantity})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;