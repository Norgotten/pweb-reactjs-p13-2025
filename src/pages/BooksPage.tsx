// src/pages/BooksPage.tsx - ENHANCED with Filter & Sort
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../config/api';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import type { Book } from '../contexts/CartContext';

const ITEMS_PER_PAGE = 5;

interface Genre {
  id: string;
  name: string;
}

const BooksPage: React.FC = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('title_asc');

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

  const fetchGenres = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GENRES);
      const genreData = response.data.data || [];
      setGenres(genreData);
    } catch (err) {
      console.error('Failed to fetch genres', err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  // Apply filters and sorting
  const getFilteredAndSortedBooks = () => {
    let result = [...allBooks];

    // Search filter
    if (searchQuery) {
      result = result.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.writer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre) {
      result = result.filter(book => 
        book.genre.toLowerCase() === selectedGenre.toLowerCase()
      );
    }

    // Sorting
    switch (sortBy) {
      case 'title_asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price_asc':
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price_desc':
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'stock_asc':
        result.sort((a, b) => a.stock_quantity - b.stock_quantity);
        break;
      case 'stock_desc':
        result.sort((a, b) => b.stock_quantity - a.stock_quantity);
        break;
      default:
        break;
    }

    return result;
  };

  const filteredBooks = getFilteredAndSortedBooks();

  // Pagination logic
  const pageCount = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const currentItems = filteredBooks.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  // Reset to page 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedGenre, sortBy]);

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSortBy('title_asc');
  };

  const hasActiveFilters = searchQuery || selectedGenre || sortBy !== 'title_asc';

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
          <h2 className="text-3xl font-bold">Books Library</h2>
          <p className="text-light-text mt-1">
            {loading ? 'Loading...' : `${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <Link
          to="/books/add"
          className="bg-brand-color text-white font-semibold px-6 py-2.5 rounded-md text-sm uppercase hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          + Add Book
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-lg border border-border-color mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark-text mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
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
          </div>

          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Filter by Genre
            </label>
            <select 
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full border border-border-color rounded-md py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-brand-color"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.name}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Sort By
            </label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-border-color rounded-md py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-brand-color"
            >
              <option value="title_asc">Title: A-Z</option>
              <option value="title_desc">Title: Z-A</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock_asc">Stock: Low to High</option>
              <option value="stock_desc">Stock: High to Low</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-light-text">
              Active filters applied
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-brand-color hover:underline font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
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
        
        {!loading && !error && filteredBooks.length === 0 && (searchQuery || selectedGenre) && (
          <EmptyState
            icon="🔍"
            title="No Results Found"
            message={`No books found with current filters. Try adjusting your search.`}
            actionText="Clear Filters"
            actionLink="#"
          />
        )}

        {!loading && !error && allBooks.length === 0 && (
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
            onClick={() => handlePageClick(Math.max(0, currentPage - 1))}
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
            onClick={() => handlePageClick(Math.min(pageCount - 1, currentPage + 1))}
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