// src/pages/BooksPage.tsx - IMPROVED
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../config/api';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import type { Book } from '../contexts/CartContext';

const ITEMS_PER_PAGE = 5;

const BooksPage: React.FC = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKS);
      const booksData = response.data.data || [];
      setAllBooks(booksData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch books';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books based on search query
  const filteredBooks = allBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.writer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const pageCount = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const currentItems = filteredBooks.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  // Reset to page 0 when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pageCount - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-light-text mb-4">
        <Link to="/" className="hover:underline">Home</Link> / 
        <span className="font-medium text-dark-text"> Books</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold">Books</h2>
          <p className="text-light-text mt-1">
            {loading ? 'Loading...' : `${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
        <div className="flex items-center gap-x-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color w-64"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text hover:text-dark-text"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Add Book Button */}
          <Link
            to="/books/add"
            className="bg-brand-color text-white font-semibold px-6 py-2.5 rounded-md text-sm uppercase hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            + Add Book
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-y-6">
        {loading && <LoadingSpinner message="Loading books..." />}
        
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={fetchBooks}
          />
        )}
        
        {!loading && !error && filteredBooks.length === 0 && searchQuery && (
          <EmptyState
            icon="🔍"
            title="No Results Found"
            message={`No books found matching "${searchQuery}". Try a different search term.`}
          />
        )}

        {!loading && !error && allBooks.length === 0 && !searchQuery && (
          <EmptyState
            icon="📚"
            title="No Books Yet"
            message="Start building your library by adding your first book!"
            actionText="Add Your First Book"
            actionLink="/books/add"
          />
        )}
        
        {!loading && !error && currentItems.length > 0 && currentItems.map((book, index) => (
          <BookCard 
            key={book.id} 
            book={book} 
            listNumber={(currentPage * ITEMS_PER_PAGE) + index + 1} 
          />
        ))}
      </div>

      {/* Pagination */}
      {pageCount > 1 && !loading && !error && (
        <div className="flex justify-center items-center gap-x-2 mt-10">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="py-2 px-4 border border-border-color rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </button>
          
          <div className="flex gap-2">
            {[...Array(pageCount).keys()].map((number) => (
              <button
                key={number}
                onClick={() => handlePageClick(number)}
                className={`py-2 px-4 border rounded-md text-sm font-medium transition-all ${
                  currentPage === number 
                  ? 'bg-brand-color text-white border-brand-color' 
                  : 'border-border-color hover:bg-gray-50'
                }`}
              >
                {number + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === pageCount - 1}
            className="py-2 px-4 border border-border-color rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default BooksPage;