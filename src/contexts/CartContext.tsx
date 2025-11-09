// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// 1. Definisikan tipe data untuk Buku (untuk di-reuse)
// 'export type' aman untuk diimpor di file lain
export type Book = {
  id: string;
  title: string;
  writer: string;
  price: string;
  stock_quantity: number;
  description: string;
  genre: string;
};

// 2. Definisikan tipe data untuk Item di Keranjang
export interface CartItem extends Book {
  quantity: number;
}

// 3. Definisikan tipe data untuk Context
interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  totalPrice: number;
  addToCart: (book: Book, quantity: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
}

// 4. Buat Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Fungsi untuk mengambil data awal dari localStorage
const getInitialCart = (): CartItem[] => {
  try {
    const item = window.localStorage.getItem('cartItems');
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.warn("Gagal membaca keranjang dari localStorage", error);
    return [];
  }
};

// 5. Buat "Provider"
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);

  // Efek untuk menyimpan ke localStorage setiap kali cartItems berubah
  useEffect(() => {
    try {
      window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.warn("Gagal menyimpan keranjang ke localStorage", error);
    }
  }, [cartItems]);


  const addToCart = (book: Book, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === book.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { ...book, quantity: quantity }];
      }
    });
  };

  const removeFromCart = (bookId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === bookId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Kalkulasi total
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cartItems.reduce((sum, item) => {
    // Asumsi harga "50000" adalah 5.00
    const priceAsNumber = parseFloat(item.price) / 10000;
    return sum + priceAsNumber * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 6. Buat "Custom Hook"
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};