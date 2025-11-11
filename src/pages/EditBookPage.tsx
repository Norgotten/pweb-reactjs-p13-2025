// src/pages/EditBookPage.tsx - NEW FEATURE
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../config/api';
import { z } from 'zod';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  writer: z.string().min(1, 'Writer is required').max(100, 'Writer name too long'),
  price: z.string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Price must be a positive number'),
  stock_quantity: z.number().min(0, 'Stock must be 0 or more').max(10000, 'Stock too high'),
  genre_id: z.string().min(1, 'Genre is required'),
  description: z.string().max(1000, 'Description too long').optional(),
});

interface Genre {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  writer: string;
  price: string;
  stock_quantity: number;
  genre_id: string;
  description: string;
}

const EditBookPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [genreLoading, setGenreLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    writer: '',
    price: '',
    stock_quantity: 0,
    genre_id: '',
    description: '',
  });

  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      
      setPageLoading(true);
      try {
        const response = await apiClient.get(API_ENDPOINTS.BOOK_BY_ID(bookId));
        const book = response.data.data;
        
        setFormData({
          title: book.title,
          writer: book.writer,
          price: book.price,
          stock_quantity: book.stock_quantity,
          genre_id: book.genre_id || '',
          description: book.description || '',
        });
      } catch (err: any) {
        console.error('Failed to fetch book', err);
        showToast('Failed to load book data', 'error');
        navigate('/books');
      } finally {
        setPageLoading(false);
      }
    };
    
    fetchBook();
  }, [bookId, navigate, showToast]);

  // Fetch genres
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
        }
      } catch (err: any) {
        console.error('Failed to fetch genres', err);
        const errorMsg = err.response?.data?.message || 'Failed to load genres.';
        setError(errorMsg);
      } finally {
        setGenreLoading(false);
      }
    };
    fetchGenres();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock_quantity' ? parseInt(value) || 0 : value
    }));
    
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = bookSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      showToast(validation.error.issues[0].message, 'error');
      return;
    }

    setLoading(true);
    try {
      await apiClient.put(API_ENDPOINTS.BOOK_BY_ID(bookId!), formData);
      showToast('Book updated successfully!', 'success');
      navigate(`/books/${bookId}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update book.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <LoadingSpinner message="Loading book data..." />;
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-light-text mb-4">
        <Link to="/" className="hover:underline">Home</Link> / 
        <Link to="/books" className="hover:underline"> Books</Link> / 
        <Link to={`/books/${bookId}`} className="hover:underline"> {formData.title}</Link> / 
        <span className="font-medium text-dark-text"> Edit</span>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Edit Book</h1>
        <p className="text-light-text mb-8">Update the book information below</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start gap-2">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 border border-border-color rounded-lg space-y-6">
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
              className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
              required
              disabled={loading}
            />
          </div>

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
              className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-dark-text mb-2">
                Stock Quantity <span className="text-red-500">*</span>
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
          </div>

          <div>
            <label htmlFor="genre_id" className="block text-sm font-medium text-dark-text mb-2">
              Genre <span className="text-red-500">*</span>
            </label>
            {genreLoading ? (
              <div className="w-full px-4 py-3 border border-border-color rounded-md bg-gray-100 text-light-text flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                <span>Loading genres...</span>
              </div>
            ) : (
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
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-dark-text mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color resize-none"
              disabled={loading}
            />
            <p className="text-xs text-light-text mt-1">
              {formData.description.length}/1000 characters
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || genreLoading || genres.length === 0}
              className="flex-1 bg-brand-color text-white font-semibold py-3 rounded-md hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              {loading ? '⏳ Updating...' : '✓ Update Book'}
            </button>
            <Link
              to={`/books/${bookId}`}
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

export default EditBookPage;