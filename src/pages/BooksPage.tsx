// src/pages/BooksPage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterSidebar from '../components/FilterSidebar';
import BookCard from '../components/BookCard';
import type { Book } from '../contexts/CartContext'; // Import tipe Book

const ITEMS_PER_PAGE = 5; // Tampilkan 5 buku per halaman

const BooksPage: React.FC = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]); // Semua buku dari API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' atau 'grid'
  
  // State untuk pagination manual
  const [currentPage, setCurrentPage] = useState(0); // Dimulai dari 0

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/books');
        setAllBooks(response.data.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // --- LOGIKA PAGINATION MANUAL ---
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
  // ---------------------------------

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Kolom Kiri: Filter */}
      <FilterSidebar />

      {/* Kolom Kanan: Konten Utama */}
      <div className="flex-1">
        {/* Header Konten (Judul, Sortir, View) */}
        <div className="flex flex-col md:flex-row justify-between md:items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold">Books</h2>
            <p className="text-light-text mt-1">A wide selection of books from across the globe is available here!</p>
          </div>
          <div className="flex items-center gap-x-4 mt-4 md:mt-0 flex-shrink-0">
            <select className="border border-border-color rounded-md py-2.5 px-4 font-medium text-sm">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <div className="flex border border-border-color rounded-md">
              <button 
                className={`py-2.5 px-4 ${viewMode === 'list' ? 'bg-secondary-bg text-dark-text' : 'bg-white text-light-text'}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button 
                className={`py-2.5 px-4 border-l border-border-color ${viewMode === 'grid' ? 'bg-secondary-bg text-dark-text' : 'bg-white text-light-text'}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Container Daftar Buku */}
        <div className="flex flex-col gap-y-6">
          {loading && <p>Loading books...</p>}
          {error && <p className="text-red-600">Error fetching data: {error}</p>}
          
          {!loading && !error && currentItems.map((book, index) => (
            <BookCard 
              key={book.id} 
              book={book} 
              listNumber={(currentPage * ITEMS_PER_PAGE) + index + 1} 
            />
          ))}

          {!loading && !error && currentItems.length === 0 && (
            <p>No books found.</p>
          )}
        </div>

        {/* Pagination Manual */}
        {pageCount > 1 && (
          <div className="flex justify-center items-center gap-x-2 mt-10">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className="py-2 px-4 border border-border-color rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
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
              className="py-2 px-4 border border-border-color rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;