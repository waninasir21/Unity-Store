import React, { createContext, useState, useContext, useEffect } from "react";
import { notify } from "../utils/toasts";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Signup function
  const signup = (username, password, email) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        if (users.some((user) => user.username === username)) {
          reject(new Error("Username already exists"));
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          username,
          password,
          email,
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        // removes password from user object
        const { password: _, ...userWithoutPassword } = newUser;

        // Update state
        setCurrentUser(userWithoutPassword);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(userWithoutPassword),
        );

        initializeUserData(userWithoutPassword.id);

        resolve(userWithoutPassword);
        notify.signup();
      } catch (error) {
        notify.error("Signup failed");
        reject(error);
      }
    });
  };

  // Login function
  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(
          (u) => u.username === username && u.password === password,
        );

        if (!user) {
          reject(new Error("Invalid username or password"));
          return;
        }

        // Set as current user (without password)
        const { password: _, ...userWithoutPassword } = user;

        // Update state and localStorage
        setCurrentUser(userWithoutPassword);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(userWithoutPassword),
        );

        // Small delay to ensure state update completes
        setTimeout(() => {
          resolve(userWithoutPassword);
          notify.login(userWithoutPassword.username);
        }, 50);
      } catch (error) {
        notify.error("Invalid username or password");
        reject(error);
      }
    });
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    notify.logout();
  };

  // Initialize user data (cart and orders)
  const initializeUserData = (userId) => {
    const userCartKey = `cart_${userId}`;
    const userOrdersKey = `orders_${userId}`;

    if (!localStorage.getItem(userCartKey)) {
      localStorage.setItem(userCartKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(userOrdersKey)) {
      localStorage.setItem(userOrdersKey, JSON.stringify([]));
    }
  };

  // Update user profile
  const updateProfile = (userData) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const userIndex = users.findIndex((u) => u.id === currentUser.id);

        if (userIndex === -1) {
          reject(new Error("User not found"));
          return;
        }

        const updatedUser = { ...users[userIndex], ...userData };
        users[userIndex] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users));

        const { password: _, ...userWithoutPassword } = updatedUser;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(userWithoutPassword),
        );

        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    });
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
