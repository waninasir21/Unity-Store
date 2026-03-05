import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { notify } from "../utils/toasts";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart when user changes
  useEffect(() => {
    if (currentUser) {
      loadCart();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [currentUser]);

  const loadCart = () => {
    setLoading(true);
    const userCartKey = `cart_${currentUser.id}`;
    const storedCart = localStorage.getItem(userCartKey);
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    } else {
      setCartItems([]);
    }
    setLoading(false);
  };

  // Save cart to localStorage
  const saveCart = (items) => {
    if (currentUser) {
      const userCartKey = `cart_${currentUser.id}`;
      localStorage.setItem(userCartKey, JSON.stringify(items));
    }
  };

  const addToCart = (product, quantity = 1) => {
    if (!currentUser) {
      notify.warning("Please login to add items to cart");
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      let newItems;
      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        newItems = [...prevItems, { ...product, quantity }];
      }

      saveCart(newItems);
      return newItems;
    });
    notify.addToCart();
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== productId);
      saveCart(newItems);

      return newItems;
    });
    notify.deleteFromCart();
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      );
      saveCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (currentUser) {
      const userCartKey = `cart_${currentUser.id}`;
      localStorage.setItem(userCartKey, JSON.stringify([]));
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
