// src/pages/BookDetailsPage.tsx - FIXED ALL ISSUES
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../config/api';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import type { Book } from '../contexts/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const BookDetailsPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addToCart } = useCart();
  
  const [book, setBook] = useState<Book | null>(null);
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numValue / 10000);
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
                Quantity
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
              {book.stock_quantity > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
            </button>

            {/* Stock Info */}
            <div className="text-center">
              {book.stock_quantity > 0 ? (
                <p className="text-sm text-green-600 font-medium">
                  ✓ {book.stock_quantity} units available
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">
                  ✕ This item is currently unavailable
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold mb-4">Book Details</h3>
          <div className="bg-[#4a4a4a] text-white rounded-lg overflow-hidden">
            <DetailRow label="Book Title" value={book.title} />
            <DetailRow label="Author" value={book.writer} />
            <DetailRow label="Genre" value={book.genre} isCapitalize />
            <DetailRow label="Price" value={formatCurrency(book.price)} />
            <DetailRow label="Stock Quantity" value={`${book.stock_quantity} units`} />
            <DetailRow 
              label="Description" 
              value={book.description || 'No description available for this book.'} 
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