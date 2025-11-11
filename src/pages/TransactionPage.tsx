// src/pages/TransactionPage.tsx - ENHANCED
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { apiClient, API_ENDPOINTS } from '../config/api';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TransactionPage: React.FC = () => {
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getItemPrice = (priceString: string) => {
    return parseFloat(priceString) / 10000;
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty!', 'warning');
      return;
    }

    if (!window.confirm('Proceed with checkout?')) return;

    setIsProcessing(true);
    try {
      const userResponse = await apiClient.get(API_ENDPOINTS.ME);
      const userId = userResponse.data.data.id;

      const items = cartItems.map(item => ({
        book_id: item.id,
        quantity: item.quantity,
      }));

      const response = await apiClient.post(API_ENDPOINTS.TRANSACTIONS, {
        user_id: userId,
        items: items,
      });

      const transactionId = response.data.data.transaction_id;
      
      showToast('Transaction successful!', 'success');
      clearCart();
      navigate('/transactions/history');
    } catch (err: any) {
      console.error('Checkout error:', err);
      const errorMessage = err.response?.data?.message || 'Checkout failed. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = (bookId: string, bookTitle: string) => {
    if (window.confirm(`Remove "${bookTitle}" from cart?`)) {
      removeFromCart(bookId);
      showToast('Item removed from cart', 'info');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Remove all items from cart?')) {
      clearCart();
      showToast('Cart cleared', 'info');
    }
  };

  if (isProcessing) {
    return <LoadingSpinner message="Processing your transaction..." />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* Left Column: Cart Items */}
      <div className="lg:col-span-2">
        <div className="text-sm text-light-text mb-4">
          <Link to="/" className="hover:underline">Home</Link> / 
          <span className="font-medium text-dark-text"> Checkout</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Shopping Cart</h2>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Table Header (Desktop) */}
        <div className="hidden md:grid grid-cols-5 gap-4 py-3 px-4 text-xs font-semibold text-light-text uppercase border-b border-border-color">
          <div className="col-span-2">Item</div>
          <div className="text-center">Quantity</div>
          <div className="text-center">Price</div>
          <div className="text-center">Total</div>
        </div>

        {/* Items List */}
        <div className="flex flex-col gap-y-4 mt-4">
          {cartItems.length === 0 ? (
            <div className="text-center p-10 bg-white border border-border-color rounded-lg">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-light-text mb-4">Your cart is empty.</p>
              <Link to="/books" className="text-brand-color font-medium hover:underline">
                Start Shopping →
              </Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemPrice = getItemPrice(item.price);
              const totalItemPrice = itemPrice * item.quantity;
              
              return (
                <div key={item.id} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center bg-white p-4 border border-border-color rounded-lg hover:shadow-md transition-shadow">
                  {/* Item Details */}
                  <div className="col-span-2 flex items-center gap-x-4">
                    <div className="w-16 h-20 bg-secondary-bg rounded-md shrink-0 flex items-center justify-center text-2xl">
                      📖
                    </div>
                    <div>
                      <Link to={`/books/${item.id}`}>
                        <h4 className="font-semibold text-dark-text line-clamp-1 hover:text-brand-color cursor-pointer">
                          {item.title}
                        </h4>
                      </Link>
                      <p className="text-sm text-light-text">{item.writer}</p>
                      <p className="text-xs text-light-text mt-1 capitalize">Genre: {item.genre}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {item.stock_quantity} units available
                      </p>
                    </div>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center gap-x-3">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 border border-border-color rounded-full text-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="font-semibold text-lg min-w-[30px] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock_quantity}
                      className="w-7 h-7 border border-border-color rounded-full text-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Unit Price */}
                  <div className="text-center font-medium text-dark-text">
                    {formatCurrency(itemPrice)}
                  </div>
                  
                  {/* Total Price */}
                  <div className="text-center">
                    <div className="font-semibold text-lg text-brand-color">
                      {formatCurrency(totalItemPrice)}
                    </div>
                    <button 
                      onClick={() => handleRemove(item.id, item.title)}
                      className="text-red-600 text-xs underline mt-1 hover:text-red-800 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-secondary-bg p-8 rounded-lg sticky top-28">
          <h3 className="text-2xl font-semibold mb-2">Order Summary</h3>
          <p className="text-sm text-light-text mb-6">
            Review your items before checkout
          </p>
          
          {/* Item Count */}
          <div className="flex justify-between py-3 border-b border-light-text">
            <span className="text-light-text">Items ({cartItems.length})</span>
            <span className="font-medium">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} pcs</span>
          </div>
          
          {/* Subtotal */}
          <div className="flex justify-between py-3 border-b border-light-text">
            <span className="text-light-text">Subtotal</span>
            <span className="font-medium">{formatCurrency(totalPrice)}</span>
          </div>
          
          {/* Total */}
          <div className="flex justify-between items-center py-6 border-t-2 border-dashed border-dark-text mt-4">
            <span className="text-lg font-medium">Total</span>
            <span className="text-3xl font-bold text-dark-text">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          
          {/* Checkout Button */}
          <button 
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className="w-full bg-gray-800 text-white font-semibold uppercase py-3.5 rounded-md mt-6 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {cartItems.length === 0 ? 'Cart is Empty' : 'Proceed to Checkout'}
          </button>
          
          <Link to="/books" className="block text-center mt-4 text-light-text font-medium hover:underline">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;