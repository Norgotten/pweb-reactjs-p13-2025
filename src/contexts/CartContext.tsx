// src/contexts/CartContext.tsx - Updated Book Type
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// ✅ Tipe data untuk Buku (sesuai dengan Prisma Database)
export type Book = {
  id: string;
  title: string;
  writer: string;
  publisher?: string;         // ✅ From DB (optional for backwards compatibility)
  publication_year?: number;  // ✅ From DB (optional for backwards compatibility)
  price: string;              // Backend returns as string (Decimal)
  stock_quantity: number;
  description: string;
  genre: string;              // Backend returns genre name, bukan object
  isbn?: string;              // ✅ Optional (if you add later)
  condition?: string;         // ✅ Optional (if you add later)
};

// Tipe data untuk Item di Keranjang
export interface CartItem extends Book {
  quantity: number;
}

// Tipe data untuk Context
interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  totalPrice: number;
  addToCart: (book: Book, quantity: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
}

// Buat Context
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

// Buat "Provider"
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
        // Check stock limit
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > book.stock_quantity) {
          alert(`Tidak bisa menambah lebih banyak. Stok tersedia: ${book.stock_quantity}`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === book.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        // Check stock before adding
        if (quantity > book.stock_quantity) {
          alert(`Tidak bisa menambah lebih banyak. Stok tersedia: ${book.stock_quantity}`);
          return prevItems;
        }
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
      prevItems.map((item) => {
        if (item.id === bookId) {
          // Check stock limit
          if (quantity > item.stock_quantity) {
            alert(`Tidak bisa menambah lebih banyak. Stok tersedia: ${item.stock_quantity}`);
            return item;
          }
          return { ...item, quantity: quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Kalkulasi total
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cartItems.reduce((sum, item) => {
    // Backend returns price as string, convert to number
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

// Buat "Custom Hook"
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};