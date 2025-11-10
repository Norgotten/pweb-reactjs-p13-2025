// src/pages/TransactionDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../config/api';

interface TransactionItem {
  id: string;
  book_title: string;
  quantity: number;
  price: string;
}

interface TransactionDetail {
  id: string;
  total_amount: number;
  total_price: string;
  status: string;
  created_at: string;
  items: TransactionItem[];
}

const TransactionDetailPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(API_ENDPOINTS.TRANSACTION_BY_ID(transactionId!));
        setTransaction(response.data.data);
      } catch (err) {
        console.error("Failed to fetch transaction detail", err);
      } finally {
        setLoading(false);
      }
    };
    if (transactionId) {
      fetchDetail();
    }
  }, [transactionId]);

  if (loading) return <p className="text-center py-10">Loading details...</p>;
  if (!transaction) return <p className="text-center py-10">Transaction not found.</p>;

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(value) / 10000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
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
        <Link to="/transactions/history" className="hover:underline"> Transaction History</Link> / 
        <span className="font-medium text-dark-text"> Detail</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Transaction Detail</h1>
        <p className="text-light-text mt-2">ID: {transaction.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Items */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold mb-4">Items Purchased</h3>
          
          {/* Item List */}
          <div className="flex flex-col gap-4">
            {transaction.items.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between bg-white p-4 border border-border-color rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-secondary-bg rounded-md flex items-center justify-center text-2xl">
                    📖
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-text">{item.book_title}</h4>
                    <p className="text-sm text-light-text">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium text-brand-color mt-1">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-dark-text">
                    {formatCurrency((parseFloat(item.price) * item.quantity).toString())}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-secondary-bg p-8 rounded-lg sticky top-28">
            <h3 className="text-2xl font-semibold mb-6">Order Summary</h3>
            
            {/* Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b border-light-text">
                <span className="text-light-text">Transaction ID</span>
                <span className="font-mono text-sm text-dark-text">
                  {transaction.id.substring(0, 10)}...
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-light-text">
                <span className="text-light-text">Date</span>
                <span className="font-medium text-dark-text">
                  {formatDate(transaction.created_at)}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-light-text">
                <span className="text-light-text">Total Items</span>
                <span className="font-semibold text-dark-text">
                  {transaction.total_amount} items
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-light-text">
                <span className="text-light-text">Status</span>
                <span className="font-semibold text-green-600 capitalize">
                  {transaction.status}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-6 border-t-2 border-dashed border-dark-text">
              <span className="text-lg font-medium">Grand Total</span>
              <span className="text-3xl font-bold text-dark-text">
                {formatCurrency(transaction.total_price)}
              </span>
            </div>

            {/* Back Button */}
            <Link 
              to="/transactions/history"
              className="block text-center mt-6 bg-gray-800 text-white font-semibold uppercase py-3 rounded-md hover:bg-gray-700"
            >
              Back to History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;