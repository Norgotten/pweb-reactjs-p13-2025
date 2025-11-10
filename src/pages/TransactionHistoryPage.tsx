// src/pages/TransactionHistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../config/api';

interface Transaction {
  id: string;
  total_amount: number;
  total_price: string;
  status: string;
  created_at: string;
}

const TransactionHistoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(API_ENDPOINTS.TRANSACTIONS);
        setTransactions(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Apply search & sort
  useEffect(() => {
    let result = [...transactions];

    // Search by ID
    if (searchId) {
      result = result.filter(t => t.id.includes(searchId));
    }

    // Sort
    switch (sortBy) {
      case 'id_asc':
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case 'id_desc':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'amount_asc':
        result.sort((a, b) => a.total_amount - b.total_amount);
        break;
      case 'amount_desc':
        result.sort((a, b) => b.total_amount - a.total_amount);
        break;
      case 'price_asc':
        result.sort((a, b) => parseFloat(a.total_price) - parseFloat(b.total_price));
        break;
      case 'price_desc':
        result.sort((a, b) => parseFloat(b.total_price) - parseFloat(a.total_price));
        break;
      default: // newest
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredTransactions(result);
  }, [searchId, sortBy, transactions]);

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(value) / 10000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-light-text mb-4">
        <Link to="/" className="hover:underline">Home</Link> / 
        <span className="font-medium text-dark-text"> Transaction History</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Transaction History</h1>
          <p className="text-light-text mt-2">{filteredTransactions.length} transactions found</p>
        </div>
        
        {/* Controls */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search by ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="px-4 py-2 border border-border-color rounded-md bg-secondary-bg focus:outline-none focus:ring-2 focus:ring-brand-color"
          />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-border-color rounded-md py-2 px-4 font-medium text-sm bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="id_asc">ID: A-Z</option>
            <option value="id_desc">ID: Z-A</option>
            <option value="amount_asc">Amount: Low to High</option>
            <option value="amount_desc">Amount: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center py-10">Loading transactions...</p>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-10 bg-white border border-border-color rounded-lg">
          <p className="text-light-text mb-4">No transactions found.</p>
          <Link to="/books" className="text-brand-color font-medium hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-border-color rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-5 gap-4 py-4 px-6 bg-secondary-bg font-semibold text-sm text-dark-text border-b border-border-color">
            <div>Transaction ID</div>
            <div className="text-center">Total Items</div>
            <div className="text-center">Total Price</div>
            <div className="text-center">Date</div>
            <div className="text-center">Action</div>
          </div>

          {/* Table Body */}
          {filteredTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 px-6 border-b border-border-color hover:bg-gray-50 transition-colors"
            >
              <div className="font-mono text-sm text-light-text">
                {transaction.id.substring(0, 15)}...
              </div>
              <div className="text-center font-semibold">
                {transaction.total_amount} items
              </div>
              <div className="text-center font-bold text-brand-color">
                {formatCurrency(transaction.total_price)}
              </div>
              <div className="text-center text-sm text-light-text">
                {formatDate(transaction.created_at)}
              </div>
              <div className="text-center">
                <Link 
                  to={`/transactions/${transaction.id}`}
                  className="text-brand-color font-medium hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryPage;