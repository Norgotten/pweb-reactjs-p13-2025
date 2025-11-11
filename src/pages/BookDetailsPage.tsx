// src/pages/BookDetailsPage.tsx - ENHANCED
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../config/api';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Book } from '../contexts/CartContext';

const BookDetailsPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(API_ENDPOINTS.BOOK_BY_ID(bookId!));
        setBook(response.data.data);
      } catch (error) {
        console.error("Failed to fetch book details", error);
        showToast('Failed to load book details', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (bookId) {
      fetchBook();
    }
  }, [bookId, showToast]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${book?.title}"?`)) return;

    try {
      await apiClient.delete(API_ENDPOINTS.BOOK_BY_ID(bookId!));
      showToast('Book deleted successfully!', 'success');
      navigate('/books');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete book';
      showToast(errorMsg, 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Loading book details..." />;
  if (!book) {
    return (
      <div className="text-center py-10">
        <p className="text-light-text mb-4">Book not found.</p>
        <Link to="/books" className="text-brand-color hover:underline">
          Back to Books
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(book.price) / 10000);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    showToast(`${quantity} "${book.title}" added to cart!`, 'success');
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-light-text mb-4">
        <Link to="/" className="hover:underline">Home</Link> / 
        <Link to="/books" className="hover:underline"> Books</Link> / 
        <span className="font-medium text-dark-text"> {book.title}</span>
      </div>

      {/* Header with Action Buttons */}
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">{book.title}</h1>
          <p className="text-xl text-light-text mt-2">by {book.writer}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/books/${bookId}/edit`}
            className="bg-brand-color text-white font-semibold px-6 py-2.5 rounded-md hover:opacity-90 transition-opacity"
          >
            ✏️ Edit Book
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-red-700 transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Price & Buy */}
        <div className="lg:col-span-1">
          <p className="text-4xl font-bold text-dark-text">
            {formattedPrice}
          </p>
          <div className="flex items-center gap-x-4 my-6">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 border border-border-color rounded-md text-2xl font-light hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              -
            </button>
            <span className="text-xl font-semibold w-10 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => Math.min(book.stock_quantity, q + 1))}
              disabled={quantity >= book.stock_quantity}
              className="w-10 h-10 border border-border-color rounded-md text-2xl font-light hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              +
            </button>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={book.stock_quantity === 0}
            className="w-full bg-brand-color text-white font-semibold py-3.5 rounded-md uppercase text-sm hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {book.stock_quantity > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
          </button>
          <p className="text-sm text-light-text mt-4 text-center">
            {book.stock_quantity > 0 
              ? `${book.stock_quantity} units available` 
              : 'This item is currently unavailable'}
          </p>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold mb-4">Book Details</h3>
          <div className="bg-[#4a4a4a] text-white rounded-lg overflow-hidden">
            <DetailRow label="Title" value={book.title} />
            <DetailRow label="Author" value={book.writer} />
            <DetailRow label="Genre" value={book.genre} isCapitalize />
            <DetailRow label="Description" value={book.description || 'No description available'} />
            <DetailRow label="Stock Quantity" value={book.stock_quantity.toString()} />
            <DetailRow label="Publisher" value="N/A" />
            <DetailRow label="Published Year" value="N/A" />
            <DetailRow label="ISBN" value="N/A" isLast />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component
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