// src/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';

export const useOrders = (userId) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load orders when userId changes
  useEffect(() => {
    if (userId) {
      loadOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [userId]);

  const loadOrders = () => {
    try {
      setLoading(true);
      const userOrdersKey = `orders_${userId}`;
      const storedOrders = localStorage.getItem(userOrdersKey);
      
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        // Sort by date (newest first)
        parsedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(parsedOrders);
      } else {
        setOrders([]);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveOrders = useCallback((updatedOrders) => {
    try {
      if (userId) {
        const userOrdersKey = `orders_${userId}`;
        localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));
      }
    } catch (err) {
      console.error('Error saving orders:', err);
      setError('Failed to save orders');
    }
  }, [userId]);

  // Create new order
  const createOrder = async (cartItems, totalAmount, shippingAddress, paymentMethod = 'Cash on Delivery') => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        throw new Error('User not authenticated');
      }

      if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Calculate dates
      const orderDate = new Date();
      const estimatedDelivery = new Date(orderDate);
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

      // Generate unique order number
      const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase() + 
                         Math.random().toString(36).substr(2, 5).toUpperCase();

      // Create order object
      const newOrder = {
        id: Date.now().toString(),
        orderNumber,
        userId,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          subtotal: item.price * item.quantity
        })),
        totalAmount,
        subtotal: totalAmount * 0.92, // Approximate (without tax/shipping)
        tax: totalAmount * 0.08,
        shipping: totalAmount > 50 ? 0 : 5.99,
        shippingAddress,
        paymentMethod,
        orderDate: orderDate.toISOString(),
        estimatedDelivery: estimatedDelivery.toISOString(),
        deliveredDate: null,
        status: 'processing', // processing, confirmed, shipped, delivered, cancelled
        paymentStatus: 'pending', // pending, paid, failed
        trackingNumber: generateTrackingNumber(),
        notes: ''
      };

      // Get existing orders
      const existingOrders = [...orders];
      
      // Add new order
      const updatedOrders = [newOrder, ...existingOrders];
      
      // Save to localStorage
      saveOrders(updatedOrders);
      setOrders(updatedOrders);
      
      return newOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generate random tracking number
  const generateTrackingNumber = () => {
    const prefix = 'TRK';
    const numbers = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    return `${prefix}${numbers}`;
  };

  // Get single order by ID
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  // Get order by order number
  const getOrderByNumber = (orderNumber) => {
    return orders.find(order => order.orderNumber === orderNumber);
  };

  // Cancel order
  const cancelOrder = async (orderId, reason = '') => {
    try {
      setLoading(true);
      setError(null);

      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }

      const order = orders[orderIndex];
      
      // Can only cancel if status is processing or confirmed
      if (!['processing', 'confirmed'].includes(order.status)) {
        throw new Error('Cannot cancel order that is already shipped or delivered');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = {
        ...order,
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancellationReason: reason
      };

      saveOrders(updatedOrders);
      setOrders(updatedOrders);
      
      return updatedOrders[orderIndex];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      setError(null);

      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }

      const order = orders[orderIndex];
      const updatedOrders = [...orders];
      
      const statusUpdates = {
        confirmed: { status: 'confirmed', confirmedAt: new Date().toISOString() },
        shipped: { 
          status: 'shipped', 
          shippedAt: new Date().toISOString(),
          trackingNumber: generateTrackingNumber()
        },
        delivered: { 
          status: 'delivered', 
          deliveredDate: new Date().toISOString() 
        },
        cancelled: { status: 'cancelled', cancelledAt: new Date().toISOString() }
      };

      updatedOrders[orderIndex] = {
        ...order,
        ...statusUpdates[newStatus]
      };

      saveOrders(updatedOrders);
      setOrders(updatedOrders);
      
      return updatedOrders[orderIndex];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark as delivered
  const markAsDelivered = async (orderId) => {
    return updateOrderStatus(orderId, 'delivered');
  };

  // Update payment status
  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      setLoading(true);
      setError(null);

      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }

      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = {
        ...updatedOrders[orderIndex],
        paymentStatus,
        paidAt: paymentStatus === 'paid' ? new Date().toISOString() : null
      };

      saveOrders(updatedOrders);
      setOrders(updatedOrders);
      
      return updatedOrders[orderIndex];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add tracking number
  const addTrackingNumber = async (orderId, trackingNumber) => {
    try {
      setLoading(true);
      setError(null);

      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }

      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = {
        ...updatedOrders[orderIndex],
        trackingNumber,
        status: 'shipped',
        shippedAt: new Date().toISOString()
      };

      saveOrders(updatedOrders);
      setOrders(updatedOrders);
      
      return updatedOrders[orderIndex];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add note to order
  const addOrderNote = async (orderId, note) => {
    try {
      setLoading(true);
      setError(null);

      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }

      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = {
        ...updatedOrders[orderIndex],
        notes: note
      };

      saveOrders(updatedOrders);
      setOrders(updatedOrders);
      
      return updatedOrders[orderIndex];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get order statistics
  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalSpent = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const processingOrders = orders.filter(o => ['processing', 'confirmed'].includes(o.status)).length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    // Average order value
    const avgOrderValue = totalOrders > 0 
      ? totalSpent / orders.filter(o => o.status !== 'cancelled').length 
      : 0;

    // Orders by month (last 6 months)
    const last6Months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      last6Months.push(monthYear);
    }

    const ordersByMonth = last6Months.map(monthYear => {
      const [month, year] = monthYear.split(' ');
      const count = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.toLocaleDateString('en-US', { month: 'short' }) === month &&
               orderDate.getFullYear().toString() === year;
      }).length;
      return { month: monthYear, count };
    });

    // Most ordered products
    const productCount = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productCount[item.id]) {
          productCount[item.id] = {
            id: item.id,
            name: item.name,
            quantity: 0,
            totalSpent: 0
          };
        }
        productCount[item.id].quantity += item.quantity;
        productCount[item.id].totalSpent += item.subtotal || (item.price * item.quantity);
      });
    });

    const topProducts = Object.values(productCount)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalOrders,
      totalSpent,
      deliveredOrders,
      processingOrders,
      shippedOrders,
      cancelledOrders,
      avgOrderValue,
      ordersByMonth,
      topProducts
    };
  };

  // Filter orders by status
  const getOrdersByStatus = (status) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  // Filter orders by date range
  const getOrdersByDateRange = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return orders.filter(order => {
      const orderDate = new Date(order.orderDate).getTime();
      return orderDate >= start && orderDate <= end;
    });
  };

  // Search orders
  const searchOrders = (query) => {
    const searchTerm = query.toLowerCase();
    return orders.filter(order => 
      order.orderNumber.toLowerCase().includes(searchTerm) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm)) ||
      order.shippingAddress.toLowerCase().includes(searchTerm)
    );
  };

  // Get active orders (not delivered or cancelled)
  const getActiveOrders = () => {
    return orders.filter(order => 
      !['delivered', 'cancelled'].includes(order.status)
    );
  };

  // Check if order can be cancelled
  const canCancelOrder = (order) => {
    return ['processing', 'confirmed'].includes(order.status);
  };

  // Calculate days until delivery
  const getDaysUntilDelivery = (order) => {
    if (order.status === 'delivered') return 0;
    
    const today = new Date();
    const delivery = new Date(order.estimatedDelivery);
    const diffTime = delivery - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  return {
    orders,
    loading,
    error,
    selectedOrder,
    setSelectedOrder,
    createOrder,
    getOrderById,
    getOrderByNumber,
    cancelOrder,
    updateOrderStatus,
    markAsDelivered,
    updatePaymentStatus,
    addTrackingNumber,
    addOrderNote,
    getOrderStats,
    getOrdersByStatus,
    getOrdersByDateRange,
    searchOrders,
    getActiveOrders,
    canCancelOrder,
    getDaysUntilDelivery,
    refreshOrders: loadOrders
  };
};