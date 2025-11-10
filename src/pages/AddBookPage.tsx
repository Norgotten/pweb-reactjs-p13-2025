import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../config/api';
import { z } from 'zod';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  writer: z.string().min(1, 'Writer is required'),
  price: z.string().min(1, 'Price is required'),
  stock_quantity: z.number().min(0, 'Stock must be 0 or more'),
  genre_id: z.string().min(1, 'Genre is required'),
  description: z.string().optional(),
});

interface Genre {
  id: string;
  name: string;
}

const AddBookPage: React.FC = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    writer: '',
    price: '',
    stock_quantity: 0,
    genre_id: '',
    description: '',
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.GENRES);
        setGenres(response.data.data || []);
      } catch (err) {
        console.error('Failed to fetch genres', err);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = bookSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await apiClient.post(API_ENDPOINTS.BOOKS, formData);
      alert('Book added successfully!');
      navigate('/books');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add book');
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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Add New Book</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 border border-border-color rounded-lg space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-dark-text mb-2">
              Book Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
              required
            />
          </div>

          <div>
            <label htmlFor="writer" className="block text-sm font-medium text-dark-text mb-2">
              Author *
            </label>
            <input
              id="writer"
              name="writer"
              type="text"
              value={formData.writer}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-dark-text mb-2">
                Price *
              </label>
              <input
                id="price"
                name="price"
                type="text"
                value={formData.price}
                onChange={handleChange}
                placeholder="50000"
                className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
                required
              />
            </div>

            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-dark-text mb-2">
                Stock Quantity *
              </label>
              <input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="genre_id" className="block text-sm font-medium text-dark-text mb-2">
              Genre *
            </label>
            <select
              id="genre_id"
              name="genre_id"
              value={formData.genre_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
              required
            >
              <option value="">Select a genre</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
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
              className="w-full px-4 py-3 border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-brand-color"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-color text-white font-semibold py-3 rounded-md hover:opacity-90 disabled:bg-gray-400"
            >
              {loading ? 'Adding...' : 'Add Book'}
            </button>
            <Link
              to="/books"
              className="flex-1 bg-gray-200 text-dark-text font-semibold py-3 rounded-md text-center hover:bg-gray-300"
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