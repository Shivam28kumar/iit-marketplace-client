// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartShopId, setCartShopId] = useState(null);

  // --- FIX 1: Derived State (No useEffect needed for this) ---
  // We calculate total and count on every render. This prevents the "setState during render" error.
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const addToCart = (product, shopId) => {
    // 1. Check shop consistency
    if (cartShopId && cartShopId !== shopId) {
      const confirmChange = window.confirm("Reset cart to add items from this new shop?");
      if (confirmChange) {
        setCartItems([]);
        setCartShopId(shopId);
      } else {
        return; 
      }
    }

    if (cartItems.length === 0) setCartShopId(shopId);

    setCartItems(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => 
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success("Added to cart");
  };

  const decreaseQuantity = (productId) => {
    setCartItems(prev => {
        const existing = prev.find(item => item._id === productId);
        if (existing?.quantity === 1) {
            return prev.filter(item => item._id !== productId);
        }
        return prev.map(item => item._id === productId ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCartShopId(null);
  };

  // Only reset shop ID if cart becomes empty manually
  useEffect(() => {
    if (cartItems.length === 0) setCartShopId(null);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ 
        cartItems, cartShopId, cartTotal, cartCount, 
        addToCart, decreaseQuantity, removeFromCart, clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};