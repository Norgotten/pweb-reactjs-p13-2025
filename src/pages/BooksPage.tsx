// src/pages/BooksPage.tsx - Cleaned & Fixed
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../config/api';
import BookCard from '../components/BookCard';
import type { Book } from '../contexts/CartContext';

const ITEMS_PER_PAGE = 5;

const BooksPage: React.FC = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(API_ENDPOINTS.BOOKS);
        // Backend returns: { success, message, data: [...], meta: {...} }
        const booksData = response.data.data || [];
        setAllBooks(booksData);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch books';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Pagination logic
  const pageCount = Math.ceil(allBooks.length / ITEMS_PER_PAGE);
  const currentItems = allBooks.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pageCount - 1));
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-light-text mb-4">
        <Link to="/" className="hover:underline">Home</Link> / 
        <span className="font-medium text-dark-text"> Books</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Books</h2>
          <p className="text-light-text mt-1">
            A wide selection of books from across the globe is available here!
          </p>
        </div>
        <div className="flex items-center gap-x-4 mt-4 md:mt-0">
          <Link
            to="/books/add"
            className="bg-brand-color text-white font-semibold px-6 py-2.5 rounded-md text-sm uppercase hover:opacity-90 transition-opacity"
          >
            + Add Book
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-y-6">
        {loading && <p className="text-center py-10">Loading books...</p>}
        {error && <p className="text-center text-red-600 py-10">Error: {error}</p>}
        
        {!loading && !error && currentItems.map((book, index) => (
          <BookCard 
            key={book.id} 
            book={book} 
            listNumber={(currentPage * ITEMS_PER_PAGE) + index + 1} 
          />
        ))}

        {!loading && !error && currentItems.length === 0 && (
          <p className="text-center py-10">No books found.</p>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center items-center gap-x-2 mt-10">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="py-2 px-4 border border-border-color rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {[...Array(pageCount).keys()].map((number) => (
            <button
              key={number}
              onClick={() => handlePageClick(number)}
              className={`py-2 px-4 border rounded-md text-sm font-medium ${
                currentPage === number 
                ? 'bg-brand-color text-white border-brand-color' 
                : 'border-border-color hover:bg-gray-50'
              }`}
            >
              {number + 1}
            </button>
          ))}
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === pageCount - 1}
            className="py-2 px-4 border border-border-color rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BooksPage;