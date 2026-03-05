import { useState, useEffect, useCallback } from 'react';

export const useCart = (userId) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Load cart when userId changes
  useEffect(() => {
    if (userId) {
      loadCart();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [userId]);

  // Update totals whenever cart changes
  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  const loadCart = () => {
    try {
      setLoading(true);
      const userCartKey = `cart_${userId}`;
      const storedCart = localStorage.getItem(userCartKey);
      
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems([]);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load cart');
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = useCallback((items) => {
    try {
      if (userId) {
        const userCartKey = `cart_${userId}`;
        localStorage.setItem(userCartKey, JSON.stringify(items));
      }
    } catch (err) {
      console.error('Error saving cart:', err);
      setError('Failed to save cart');
    }
  }, [userId]);

  const calculateTotals = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal(total);
    setItemCount(count);
  };

  const addToCart = (product, quantity = 1) => {
    if (!userId) {
      setError('Please login to add items to cart');
      return false;
    }

    try {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        let newItems;
        if (existingItem) {
          newItems = prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...prevItems, { 
            id: product.id,
            name: product.name || product.title,
            price: product.price,
            image: product.image || product.imgUrl,
            quantity 
          }];
        }
        
        saveCart(newItems);
        return newItems;
      });
      
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
      return false;
    }
  };

  const addMultipleToCart = (products) => {
    if (!userId) {
      setError('Please login to add items to cart');
      return false;
    }

    try {
      setCartItems(prevItems => {
        let newItems = [...prevItems];
        
        products.forEach(product => {
          const existingItem = newItems.find(item => item.id === product.id);
          
          if (existingItem) {
            newItems = newItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                : item
            );
          } else {
            newItems.push({ 
              id: product.id,
              name: product.name || product.title,
              price: product.price,
              image: product.image || product.imgUrl,
              quantity: product.quantity || 1
            });
          }
        });
        
        saveCart(newItems);
        return newItems;
      });
      
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to add items to cart');
      console.error('Error adding multiple to cart:', err);
      return false;
    }
  };

  const removeFromCart = (productId) => {
    try {
      setCartItems(prevItems => {
        const newItems = prevItems.filter(item => item.id !== productId);
        saveCart(newItems);
        return newItems;
      });
      
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
      return false;
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      return removeFromCart(productId);
    }
    
    try {
      setCartItems(prevItems => {
        const newItems = prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        );
        saveCart(newItems);
        return newItems;
      });
      
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error updating quantity:', err);
      return false;
    }
  };

  const incrementQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      return updateQuantity(productId, item.quantity + 1);
    }
    return false;
  };

  const decrementQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      return updateQuantity(productId, item.quantity - 1);
    }
    return false;
  };

  const clearCart = () => {
    try {
      setCartItems([]);
      if (userId) {
        const userCartKey = `cart_${userId}`;
        localStorage.setItem(userCartKey, JSON.stringify([]));
      }
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Error clearing cart:', err);
      return false;
    }
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getCartSummary = () => {
    const subtotal = cartTotal;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount
    };
  };

  const mergeCarts = (guestCart) => {
    if (!userId || !guestCart || guestCart.length === 0) return;

    try {
      setCartItems(prevItems => {
        const merged = [...prevItems];
        
        guestCart.forEach(guestItem => {
          const existingItem = merged.find(item => item.id === guestItem.id);
          
          if (existingItem) {
            existingItem.quantity += guestItem.quantity;
          } else {
            merged.push(guestItem);
          }
        });
        
        saveCart(merged);
        return merged;
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to merge carts');
      console.error('Error merging carts:', err);
    }
  };

  return {
    cartItems,
    loading,
    error,
    cartTotal,
    itemCount,
    addToCart,
    addMultipleToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    getCartSummary,
    mergeCarts,
    refreshCart: loadCart
  };
};