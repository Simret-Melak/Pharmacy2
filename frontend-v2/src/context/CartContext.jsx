// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pharmacyCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('pharmacyCart');
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('pharmacyCart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // Add item to cart
  const addToCart = (medication, quantity = 1) => {
    console.log('CartContext: Adding to cart', medication.name);
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === medication.id);
      
      if (existingItem) {
        // Update quantity
        return prevCart.map(item =>
          item.id === medication.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem = {
          id: medication.id,
          medication_id: medication.id,
          name: medication.name,
          medication_name: medication.name,
          price: parseFloat(medication.price),
          quantity: quantity,
          image_url: medication.image_url,
          dosage: medication.dosage,
          stock: medication.stock_quantity || 100,
          is_prescription_required: medication.is_prescription_required
        };
        return [...prevCart, newItem];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (medicationId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== medicationId));
  };

  // Update item quantity
  const updateQuantity = (medicationId, quantity) => {
    if (quantity < 1) {
      removeFromCart(medicationId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === medicationId ? { ...item, quantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('pharmacyCart');
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Get cart item count
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      itemCount,
      isInitialized
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Make sure this is exported as a NAMED export
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Also export the context itself
export default CartContext;