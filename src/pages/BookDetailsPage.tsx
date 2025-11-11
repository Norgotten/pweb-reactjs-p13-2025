// src/pages/BookDetailsPage.tsx - COMPLETE VERSION (All DB Fields)
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../config/api';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import type { Book } from '../contexts/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

// ✅ Extended Book interface with all DB fields
interface BookDetail extends Book {
  publisher?: string;           // ✅ From DB
  publication_year?: number;    // ✅ From DB
  isbn?: string;                // ✅ Optional (not in your DB yet)
  condition?: string;           // ✅ Optional (not in your DB yet)
}

const BookDetailsPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addToCart } = useCart();
  
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) {
        setError('Book ID not found');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.get(API_ENDPOINTS.BOOK_BY_ID(bookId));
        setBook(response.data.data);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to load book details';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId, showToast]);

  const handleDelete = async () => {
    if (!book || !bookId) return;
    
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) return;

    try {
      await apiClient.delete(API_ENDPOINTS.BOOK_BY_ID(bookId));
      showToast('Book deleted successfully!', 'success');
      navigate('/books');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete book';
      showToast(errorMsg, 'error');
    }
  };

  const handleAddToCart = () => {
    if (!book) return;
    
    if (book.stock_quantity === 0) {
      showToast('Sorry, this book is out of stock', 'warning');
      return;
    }

    if (quantity > book.stock_quantity) {
      showToast(`Only ${book.stock_quantity} units available`, 'warning');
      return;
    }

    addToCart(book, quantity);
    showToast(`${quantity} "${book.title}" added to cart!`, 'success');
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const actualPrice = numValue / 10000;
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(actualPrice);
  };

  if (loading) return <LoadingSpinner message="Loading book details..." />;
  
  if (error) return (
    <ErrorMessage 
      message={error} 
      onRetry={() => window.location.reload()}
    />
  );
  
  if (!book) return (
    <div className="text-center py-10">
      <p className="text-light-text mb-4">Book not found.</p>
      <Link to="/books" className="text-brand-color font-medium hover:underline">
        Back to Books
      </Link>
    </div>
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-light-text mb-4">
        <Link to="/" className="hover:underline">Home</Link> / 
        <Link to="/books" className="hover:underline"> Books</Link> / 
        <span className="font-medium text-dark-text"> {book.title}</span>
      </div>

      {/* Header with Action Buttons */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-light-text">by {book.writer}</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            to={`/books/${bookId}/edit`}
            className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-blue-700 transition-colors"
          >
            ✏️ Edit Book
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-red-700 transition-colors"
          >
            🗑️ Delete Book
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Price & Buy */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-border-color sticky top-28">
            <p className="text-4xl font-bold text-dark-text mb-6">
              {formatCurrency(book.price)}
            </p>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark-text mb-3">
                Jumlah
              </label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-12 h-12 border border-border-color rounded-md text-2xl font-light hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-semibold min-w-[50px] text-center">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(q => Math.min(book.stock_quantity, q + 1))}
                  disabled={quantity >= book.stock_quantity}
                  className="w-12 h-12 border border-border-color rounded-md text-2xl font-light hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={book.stock_quantity === 0}
              className="w-full bg-brand-color text-white font-semibold py-4 rounded-md uppercase text-sm hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all mb-4"
            >
              {book.stock_quantity > 0 ? '🛒 Tambah ke Keranjang' : 'Stok Habis'}
            </button>

            {/* Stock Info */}
            <div className="text-center">
              {book.stock_quantity > 0 ? (
                <p className="text-sm text-green-600 font-medium">
                  ✓ {book.stock_quantity} unit tersedia
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">
                  ✕ Buku sedang tidak tersedia
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details - ✅ WITH ALL DB FIELDS */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold mb-4">Detail Buku</h3>
          <div className="bg-[#4a4a4a] text-white rounded-lg overflow-hidden">
            <DetailRow label="Judul Buku" value={book.title} />
            <DetailRow label="Penulis" value={book.writer} />
            
            {/* ✅ Publisher (NEW) */}
            {book.publisher && (
              <DetailRow label="Penerbit" value={book.publisher} />
            )}
            
            {/* ✅ Publication Year (NEW) */}
            {book.publication_year && (
              <DetailRow label="Tahun Terbit" value={book.publication_year.toString()} />
            )}
            
            <DetailRow label="Genre" value={book.genre} isCapitalize />
            <DetailRow label="Harga" value={formatCurrency(book.price)} />
            <DetailRow label="Stok" value={`${book.stock_quantity} unit`} />
            
            {/* ✅ ISBN (Optional - if exists) */}
            {book.isbn && (
              <DetailRow label="ISBN" value={book.isbn} />
            )}
            
            {/* ✅ Condition (Optional - if exists) */}
            {book.condition && (
              <DetailRow label="Kondisi" value={book.condition} isCapitalize />
            )}
            
            <DetailRow 
              label="Deskripsi" 
              value={book.description || 'Tidak ada deskripsi untuk buku ini.'} 
              isLast 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component untuk Detail Row
const DetailRow: React.FC<{ 
  label: string; 
  value: string; 
  isCapitalize?: boolean;
  isLast?: boolean;
}> = ({ label, value, isCapitalize, isLast }) => (
  <div className={`grid grid-cols-3 gap-4 p-6 ${!isLast ? 'border-b border-gray-600' : ''}`}>
    <div className="font-semibold">{label}</div>
    <div className={`col-span-2 text-gray-300 leading-relaxed ${isCapitalize ? 'capitalize' : ''}`}>
      {value}
    </div>
  </div>
);

export default BookDetailsPage;