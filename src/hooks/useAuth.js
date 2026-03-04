// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Signup function
  const signup = async (username, password, email, additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get existing users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if username already exists
      if (users.some(user => user.username === username)) {
        throw new Error('Username already exists');
      }

      // Check if email already exists
      if (users.some(user => user.email === email)) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        password, // In real app, you'd hash this
        email,
        ...additionalData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Set as current user (without password)
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      // Initialize user's cart and orders
      initializeUserData(userWithoutPassword.id);

      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === username && u.password === password);

      if (!user) {
        throw new Error('Invalid username or password');
      }

      // Set as current user (without password)
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
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
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === currentUser.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Check if username is taken (if changing username)
      if (userData.username && userData.username !== currentUser.username) {
        if (users.some(u => u.username === userData.username && u.id !== currentUser.id)) {
          throw new Error('Username already taken');
        }
      }

      // Check if email is taken (if changing email)
      if (userData.email && userData.email !== currentUser.email) {
        if (users.some(u => u.email === userData.email && u.id !== currentUser.id)) {
          throw new Error('Email already registered');
        }
      }

      // Update user
      const updatedUser = { 
        ...users[userIndex], 
        ...userData,
        updatedAt: new Date().toISOString()
      };
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));

      // Update current user
      const { password: _, ...userWithoutPassword } = updatedUser;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === currentUser.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Verify old password
      if (users[userIndex].password !== oldPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      users[userIndex].password = newPassword;
      users[userIndex].updatedAt = new Date().toISOString();
      localStorage.setItem('users', JSON.stringify(users));

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const filteredUsers = users.filter(u => u.id !== currentUser.id);
      
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      
      // Clear user data
      localStorage.removeItem(`cart_${currentUser.id}`);
      localStorage.removeItem(`orders_${currentUser.id}`);
      localStorage.removeItem('currentUser');
      
      setCurrentUser(null);

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if username is available
  const isUsernameAvailable = async (username) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return !users.some(user => user.username === username);
    } catch (err) {
      console.error('Error checking username:', err);
      return false;
    }
  };

  // Get user by ID
  const getUserById = (userId) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === userId);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    } catch (err) {
      console.error('Error getting user:', err);
      return null;
    }
  };

  return {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    isUsernameAvailable,
    getUserById
  };
};