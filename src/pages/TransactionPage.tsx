// src/pages/TransactionPage.tsx
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const TransactionPage: React.FC = () => {
  const { cartItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  // Helper untuk format harga
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getItemPrice = (priceString: string) => {
    return parseFloat(priceString) / 10000; // Sesuaikan pembagi
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* Kolom Kiri: Item Keranjang */}
      <div className="lg:col-span-2">
        <div className="text-sm text-light-text mb-4">
          <Link to="/" className="hover:underline">Home</Link> / 
          <span className="font-medium text-dark-text"> Checkout</span>
        </div>

        {/* Header Tabel */}
        <div className="hidden md:grid grid-cols-5 gap-4 py-3 px-4 text-xs font-semibold text-light-text uppercase border-b border-border-color">
          <div className="col-span-2">Item</div>
          <div className="text-center">Quantity</div>
          <div className="text-center">Price</div>
          <div className="text-center">Total Price</div>
        </div>

        {/* Daftar Item */}
        <div className="flex flex-col gap-y-4 mt-4">
          {cartItems.length === 0 ? (
            <p className="text-center p-10 bg-white border border-border-color rounded-lg">
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => {
              const itemPrice = getItemPrice(item.price);
              const totalItemPrice = itemPrice * item.quantity;
              
              return (
                <div key={item.id} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center bg-white p-4 border border-border-color rounded-lg">
                  {/* Item Details */}
                  <div className="col-span-2 flex items-center gap-x-4">
                    <div className="w-16 h-20 bg-secondary-bg rounded-md flex-shrink-0"></div>
                    <div>
                      <p className="text-xs text-light-text">ISBN {item.id.substring(0, 10)}...</p>
                      <h4 className="font-semibold text-dark-text line-clamp-1">{item.title}</h4>
                      <p className="text-sm text-light-text">{item.writer}</p>
                    </div>
                  </div>
                  {/* Kuantitas */}
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
                  {/* Harga */}
                  <div className="text-center font-medium">
                    {formatCurrency(itemPrice)}
                  </div>
                  {/* Total */}
                  <div className="text-center font-semibold text-lg">
                    {formatCurrency(totalItemPrice)}
                  </div>
                  {/* Tombol Hapus (untuk mobile) */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-light-text text-sm underline md:hidden col-span-2 text-right"
                  >
                    Remove
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Kolom Kanan: Ringkasan Belanja */}
      <div className="lg:col-span-1">
        <div className="bg-secondary-bg p-8 rounded-lg sticky top-28">
          <h3 className="text-2xl font-semibold mb-2">Shopping Summary</h3>
          <p className="text-sm text-light-text mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
          </p>
          <div className="flex justify-between items-center py-6 border-b border-dashed border-light-text">
            <span className="text-lg font-medium">Total</span>
            <span className="text-3xl font-bold text-dark-text">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <button className="w-full bg-gray-800 text-white font-semibold uppercase py-3.5 rounded-md mt-6 hover:bg-gray-700">
            Checkout
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