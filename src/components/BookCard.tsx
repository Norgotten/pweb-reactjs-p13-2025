import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import type { Book } from '../contexts/CartContext';

interface BookCardProps {
  book: Book;
  listNumber: number;
}

const BookCard: React.FC<BookCardProps> = ({ book, listNumber }) => {
  const { addToCart } = useCart();

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(book.price) / 10000);

  return (
    <div className="flex items-start gap-x-6 bg-card-bg p-6 border border-border-color rounded-lg hover:shadow-md transition-shadow">
      <span className="text-lg font-semibold text-light-text pt-1">
        {listNumber}.
      </span>
      
      {/* Detail Buku */}
      <div className="flex-1">
        <span className="inline-block bg-secondary-bg text-brand-color text-xs font-semibold px-3 py-1 rounded-full uppercase">
          {book.genre}
        </span>
        <Link to={`/books/${book.id}`}>
          <h3 className="text-xl font-semibold text-dark-text mt-2 mb-1 hover:text-brand-color cursor-pointer">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-light-text italic">
          by {book.writer}
        </p>
        <p className="text-sm text-light-text mt-4 leading-relaxed line-clamp-2">
          {book.description || 'No description available for this title.'}
        </p>
      </div>
      
      {/* Bagian Harga & Tombol */}
      <div className="flex flex-col items-end gap-y-1">
        <p className="text-2xl font-bold text-dark-text">
          {formattedPrice}
        </p>
        <button 
          onClick={() => addToCart(book, 1)}
          className="bg-brand-color text-white font-semibold px-6 py-2.5 rounded-md text-sm uppercase flex items-center gap-x-2 hover:opacity-90 transition-opacity"
        >
          <span>🛒</span>
          BUY
        </button>
      </div>
    </div>
  );
};

export default BookCard;