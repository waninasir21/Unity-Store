// src/context/OrderContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders when user changes
  useEffect(() => {
    if (currentUser) {
      loadOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [currentUser]);

  const loadOrders = () => {
    setLoading(true);
    const userOrdersKey = `orders_${currentUser.id}`;
    const storedOrders = localStorage.getItem(userOrdersKey);
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    setLoading(false);
  };

  // Create new order
  const createOrder = (cartItems, totalAmount, shippingAddress) => {
    return new Promise((resolve, reject) => {
      try {
        if (!currentUser) {
          reject(new Error("User not authenticated"));
          return;
        }

        // Calculate delivery date (7 days from now)
        const orderDate = new Date();
        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 7);

        // Create order object
        const newOrder = {
          id: Date.now().toString(),
          userId: currentUser.id,
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          totalAmount,
          shippingAddress,
          orderDate: orderDate.toISOString(),
          estimatedDelivery: deliveryDate.toISOString(),
          deliveredDate: null,
          status: "processing", // processing, shipped, delivered, cancelled
          paymentMethod: "Cash on Delivery", // Default for now
        };

        // Get existing orders
        const userOrdersKey = `orders_${currentUser.id}`;
        const existingOrders = JSON.parse(
          localStorage.getItem(userOrdersKey) || "[]",
        );

        // Add new order
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));

        setOrders(updatedOrders);
        resolve(newOrder);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Get single order by ID
  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  // Cancel order
  const cancelOrder = (orderId) => {
    return new Promise((resolve, reject) => {
      try {
        const updatedOrders = orders.map((order) => {
          if (order.id === orderId) {
            // Can only cancel if status is processing
            if (order.status !== "processing") {
              reject(new Error("Cannot cancel order that is already shipped"));
              return order;
            }
            return { ...order, status: "cancelled" };
          }
          return order;
        });

        const userOrdersKey = `orders_${currentUser.id}`;
        localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
        resolve(updatedOrders.find((o) => o.id === orderId));
      } catch (error) {
        reject(error);
      }
    });
  };

  // Mark as delivered (for demo purposes)
  const markAsDelivered = (orderId) => {
    return new Promise((resolve, reject) => {
      try {
        const deliveredDate = new Date().toISOString();
        const updatedOrders = orders.map((order) => {
          if (order.id === orderId) {
            return {
              ...order,
              status: "delivered",
              deliveredDate,
            };
          }
          return order;
        });

        const userOrdersKey = `orders_${currentUser.id}`;
        localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
        resolve(updatedOrders.find((o) => o.id === orderId));
      } catch (error) {
        reject(error);
      }
    });
  };

  // Get order statistics
  const getOrderStats = () => {
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(
      (o) => o.status === "delivered",
    ).length;
    const processingOrders = orders.filter(
      (o) => o.status === "processing",
    ).length;
    const cancelledOrders = orders.filter(
      (o) => o.status === "cancelled",
    ).length;
    const totalSpent = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalOrders,
      deliveredOrders,
      processingOrders,
      cancelledOrders,
      totalSpent,
    };
  };

  const value = {
    orders,
    loading,
    createOrder,
    getOrderById,
    cancelOrder,
    markAsDelivered,
    getOrderStats,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};
