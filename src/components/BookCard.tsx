// src/components/BookCard.tsx - IMPROVED
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatCurrency, truncateText, getStockStatus } from '../utils/helpers';
import type { Book } from '../contexts/CartContext';

interface BookCardProps {
  book: Book;
  listNumber: number;
}

const BookCard: React.FC<BookCardProps> = ({ book, listNumber }) => {
  const { addToCart } = useCart();
  const stockStatus = getStockStatus(book.stock_quantity);

  const handleAddToCart = () => {
    if (book.stock_quantity === 0) {
      alert('Sorry, this book is out of stock');
      return;
    }
    addToCart(book, 1);
  };

  return (
    <div className="flex items-start gap-x-6 bg-card-bg p-6 border border-border-color rounded-lg hover:shadow-lg transition-all group">
      <span className="text-lg font-semibold text-light-text pt-1 min-w-[30px]">
        {listNumber}.
      </span>
      
      {/* Detail Buku */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block bg-secondary-bg text-brand-color text-xs font-semibold px-3 py-1 rounded-full uppercase">
            {book.genre}
          </span>
          <span className={`text-xs font-medium ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>
        
        <Link to={`/books/${book.id}`}>
          <h3 className="text-xl font-semibold text-dark-text mb-1 hover:text-brand-color cursor-pointer transition-colors group-hover:text-brand-color">
            {truncateText(book.title, 80)}
          </h3>
        </Link>
        
        <p className="text-sm text-light-text italic mb-3">
          by {book.writer}
        </p>
        
        <p className="text-sm text-light-text leading-relaxed line-clamp-2">
          {book.description || 'No description available for this title.'}
        </p>

        {/* Stock Info */}
        <div className="flex items-center gap-4 mt-3 text-xs text-light-text">
          <span>📦 Stock: {book.stock_quantity} units</span>
        </div>
      </div>
      
      {/* Bagian Harga & Tombol */}
      <div className="flex flex-col items-end gap-y-2 min-w-[120px]">
        <p className="text-2xl font-bold text-dark-text">
          {formatCurrency(book.price)}
        </p>
        <button 
          onClick={handleAddToCart}
          disabled={book.stock_quantity === 0}
          className="bg-brand-color text-white font-semibold px-6 py-2.5 rounded-md text-sm uppercase flex items-center gap-x-2 hover:opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed group-hover:shadow-md"
        >
          <span>🛒</span>
          <span>{book.stock_quantity === 0 ? 'SOLD OUT' : 'BUY'}</span>
        </button>
        <Link 
          to={`/books/${book.id}`}
          className="text-xs text-brand-color hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default BookCard;