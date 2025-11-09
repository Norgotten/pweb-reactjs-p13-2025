// src/pages/BookDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import type { Book } from '../contexts/CartContext';

const BookDetailsPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/books/${bookId}`);
        setBook(response.data.data);
      } catch (error) {
        console.error("Failed to fetch book details", error);
      } finally {
        setLoading(false);
      }
    };
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  if (loading) return <p className="text-center p-10">Loading details...</p>;
  if (!book) return <p className="text-center p-10">Book not found.</p>;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(book.price) / 10000);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    alert(`${quantity} "${book.title}" ditambahkan ke keranjang!`);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-light-text mb-4">
        <Link to="/" className="hover:underline">Home</Link> / 
        <Link to="/books" className="hover:underline"> Books</Link> / 
        <span className="font-medium text-dark-text"> {book.title}</span>
      </div>

      {/* Header Halaman */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">{book.title}</h1>
        <p className="text-xl text-light-text mt-2">by {book.writer}</p>
      </div>

      {/* Konten Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Kolom Kiri: Harga & Beli */}
        <div className="lg:col-span-1">
          <p className="text-4xl font-bold text-dark-text">
            {formattedPrice}
          </p>
          <div className="flex items-center gap-x-4 my-6">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 border border-border-color rounded-md text-2xl font-light hover:bg-gray-50 disabled:opacity-50"
            >
              -
            </button>
            <span className="text-xl font-semibold w-10 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 border border-border-color rounded-md text-2xl font-light hover:bg-gray-50"
            >
              +
            </button>
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-full bg-brand-color text-white font-semibold py-3.5 rounded-md uppercase text-sm hover:opacity-90"
          >
            Buy
          </button>
        </div>

        {/* Kolom Kanan: Detail */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold mb-4">Details</h3>
          <div className="bg-[#4a4a4a] text-white rounded-lg overflow-hidden">
            {/* Baris Detail */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-600">
              <div className="font-semibold">Book Title</div>
              <div className="col-span-2 text-gray-300">{book.title}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-600">
              <div className="font-semibold">Author</div>
              <div className="col-span-2 text-gray-300">{book.writer}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-600">
              <div className="font-semibold">Genre</div>
              <div className="col-span-2 text-gray-300 capitalize">{book.genre}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-600">
              <div className="font-semibold">Description</div>
              <div className="col-span-2 text-gray-300 leading-relaxed">{book.description}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-600">
              <div className="font-semibold">Stock Quantity</div>
              <div className="col-span-2 text-gray-300">{book.stock_quantity}</div>
            </div>
            {/* Data Placeholder */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-600">
              <div className="font-semibold">Published Year</div>
              <div className="col-span-2 text-gray-300">2006</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;