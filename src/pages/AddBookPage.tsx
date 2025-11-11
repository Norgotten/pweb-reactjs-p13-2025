// src/pages/AddBookPage.tsx - COMPLETE VERSION (All DB Fields)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../config/api';
import { useToast } from '../contexts/ToastContext';
import { z } from 'zod';

// ✅ Schema sesuai dengan Prisma Database
const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  writer: z.string().min(1, 'Writer is required').max(100, 'Writer name too long'),
  publisher: z.string().min(1, 'Publisher is required').max(100, 'Publisher name too long'), // ✅ REQUIRED
  publication_year: z.number()
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), `Year cannot be in the future`), // ✅ REQUIRED
  price: z.string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Price must be a positive number'),
  stock_quantity: z.number().min(0, 'Stock must be 0 or more').max(10000, 'Stock too high'),
  genre_id: z.string().min(1, 'Genre is required'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'), // ✅ REQUIRED
});

interface Genre {
  id: string;
  name: string;
}

const AddBookPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [genreLoading, setGenreLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    writer: '',
    publisher: '',           // ✅ NEW
    publication_year: new Date().getFullYear(), // ✅ NEW (default: current year)
    price: '',
    stock_quantity: 0,
    genre_id: '',
    description: '',
  });

  useEffect(() => {
    const fetchGenres = async () => {
      setGenreLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(API_ENDPOINTS.GENRES);
        const genreData = response.data.data || response.data || [];
        
        if (Array.isArray(genreData) && genreData.length > 0) {
          setGenres(genreData);
        } else {
          setError('No genres available. Please contact administrator.');
          showToast('No genres found', 'warning');
        }
      } catch (err: any) {
        console.error('Failed to fetch genres', err);
        const errorMsg = err.response?.data?.message || 'Failed to load genres';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      } finally {
        setGenreLoading(false);
      }
    };
    fetchGenres();
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock_quantity' || name === 'publication_year' 
        ? parseInt(value) || 0 
        : value
    }));
    
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = bookSchema.safeParse(formData);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0].message;
      setError(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post(API_ENDPOINTS.BOOKS, formData);
      showToast('Book added successfully!', 'success');
      navigate('/books');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to add book';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-light-text mb-4">
        <Link to="/" className="hover:underline">Home</Link> / 
        <Link to="/books" className="hover:underline"> Books</Link> / 
        <span className="font-medium text-dark-text"> Add New Book</span>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Add New Book</h1>
        <p className="text-light-text mb-8">Fill in the details below to add a new book to the library</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start gap-2">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 border border-border-color rounded-lg space-y-6">
          
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-dark-text mb-2">
              Book Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Clean Code: A Handbook of Agile Software Craftsmanship"
              className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
              required
              disabled={loading}
            />
          </div>

          {/* Writer & Publisher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="writer" className="block text-sm font-medium text-dark-text mb-2">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                id="writer"
                name="writer"
                type="text"
                value={formData.writer}
                onChange={handleChange}
                placeholder="e.g., Robert C. Martin"
                className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
                required
                disabled={loading}
              />
            </div>

            {/* ✅ Publisher (NEW) */}
            <div>
              <label htmlFor="publisher" className="block text-sm font-medium text-dark-text mb-2">
                Publisher <span className="text-red-500">*</span>
              </label>
              <input
                id="publisher"
                name="publisher"
                type="text"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="e.g., Prentice Hall"
                className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Price, Stock, Year */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-dark-text mb-2">
                Price (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="text"
                value={formData.price}
                onChange={handleChange}
                placeholder="500000"
                className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
                required
                disabled={loading}
              />
              <p className="text-xs text-light-text mt-1">Enter price in Rupiah</p>
            </div>

            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-dark-text mb-2">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                max="10000"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
                required
                disabled={loading}
              />
            </div>

            {/* ✅ Publication Year (NEW) */}
            <div>
              <label htmlFor="publication_year" className="block text-sm font-medium text-dark-text mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                id="publication_year"
                name="publication_year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.publication_year}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre_id" className="block text-sm font-medium text-dark-text mb-2">
              Genre <span className="text-red-500">*</span>
            </label>
            {genreLoading ? (
              <div className="w-full px-4 py-3 border border-border-color rounded-md bg-gray-100 text-light-text flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                <span>Loading genres...</span>
              </div>
            ) : genres.length === 0 ? (
              <div className="w-full px-4 py-3 border border-red-400 rounded-md bg-red-50 text-red-700">
                ⚠️ No genres available. Please contact administrator.
              </div>
            ) : (
              <>
                <select
                  id="genre_id"
                  name="genre_id"
                  value={formData.genre_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
                  required
                  disabled={loading}
                >
                  <option value="">Select a genre</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-light-text mt-1">
                  {genres.length} genre{genres.length !== 1 ? 's' : ''} available
                </p>
              </>
            )}
          </div>

          {/* Description - ✅ NOW REQUIRED */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-dark-text mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={1000}
              placeholder="Enter a detailed description of the book..."
              className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color resize-none"
              required
              disabled={loading}
            />
            <p className="text-xs text-light-text mt-1">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || genreLoading || genres.length === 0}
              className="flex-1 bg-brand-color text-white font-semibold py-3 rounded-md hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              {loading ? '⏳ Adding...' : '✓ Add Book'}
            </button>
            <Link
              to="/books"
              className="flex-1 bg-gray-200 text-dark-text font-semibold py-3 rounded-md text-center hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPage;