// src/pages/TransactionPage.tsx - Updated dengan Checkout
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { apiClient, API_ENDPOINTS } from '../config/api';
import { Link, useNavigate } from 'react-router-dom';

const TransactionPage: React.FC = () => {
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
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
      alert('Keranjang kosong!');
      return;
    }

    if (!window.confirm('Lanjutkan checkout?')) return;

    setIsProcessing(true);
    try {
      // Format items untuk API
      const items = cartItems.map(item => ({
        book_id: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price),
      }));

      const response = await apiClient.post(API_ENDPOINTS.TRANSACTIONS, {
        items: items,
      });

      alert('Transaksi berhasil! ID: ' + response.data.data.id);
      clearCart(); // Kosongkan keranjang
      navigate('/transactions/history'); // Arahkan ke riwayat transaksi
    } catch (err: any) {
      alert(err.response?.data?.message || 'Checkout gagal. Coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* Kolom Kiri: Item Keranjang */}
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
              onClick={() => {
                if (window.confirm('Hapus semua item?')) clearCart();
              }}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Tabel Header (Desktop) */}
        <div className="hidden md:grid grid-cols-5 gap-4 py-3 px-4 text-xs font-semibold text-light-text uppercase border-b border-border-color">
          <div className="col-span-2">Item</div>
          <div className="text-center">Quantity</div>
          <div className="text-center">Price</div>
          <div className="text-center">Total</div>
        </div>

        {/* Daftar Item */}
        <div className="flex flex-col gap-y-4 mt-4">
          {cartItems.length === 0 ? (
            <div className="text-center p-10 bg-white border border-border-color rounded-lg">
              <p className="text-light-text mb-4">Your cart is empty.</p>
              <Link to="/books" className="text-brand-color font-medium hover:underline">
                Start Shopping
              </Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemPrice = getItemPrice(item.price);
              const totalItemPrice = itemPrice * item.quantity;
              
              return (
                <div key={item.id} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center bg-white p-4 border border-border-color rounded-lg">
                  {/* Item Details */}
                  <div className="col-span-2 flex items-center gap-x-4">
                    <div className="w-16 h-20 bg-secondary-bg rounded-md flex-shrink-0 flex items-center justify-center text-2xl">
                      📖
                    </div>
                    <div>
                      <Link to={`/books/${item.id}`}>
                        <h4 className="font-semibold text-dark-text line-clamp-1 hover:text-brand-color cursor-pointer">
                          {item.title}
                        </h4>
                      </Link>
                      <p className="text-sm text-light-text">{item.writer}</p>
                      <p className="text-xs text-light-text mt-1">Genre: {item.genre}</p>
                    </div>
                  </div>
                  
                  {/* Quantity */}
                  <div className="flex items-center justify-center gap-x-3">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 border border-border-color rounded-full text-lg hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="font-semibold text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 border border-border-color rounded-full text-lg hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Price */}
                  <div className="text-center font-medium">
                    {formatCurrency(itemPrice)}
                  </div>
                  
                  {/* Total */}
                  <div className="text-center font-semibold text-lg">
                    {formatCurrency(totalItemPrice)}
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 text-sm underline md:hidden col-span-2 text-right hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Kolom Kanan: Summary */}
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
          
          {/* Total */}
          <div className="flex justify-between items-center py-6 border-b border-dashed border-light-text">
            <span className="text-lg font-medium">Total</span>
            <span className="text-3xl font-bold text-dark-text">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          
          {/* Checkout Button */}
          <button 
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || isProcessing}
            className="w-full bg-gray-800 text-white font-semibold uppercase py-3.5 rounded-md mt-6 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Checkout'}
          </button>
          
          <Link to="/books" className="block text-center mt-4 text-light-text font-medium hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;