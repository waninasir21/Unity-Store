import toast from 'react-hot-toast';

// Custom style object to match your brand
const toastStyle = {
  borderRadius: '10px',
  background: '#1a2b4b',
  color: '#fff',
  border: '1px solid #c5a059', 
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: '500',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
};

// Success toast style (green accent)
const successStyle = {
  ...toastStyle,

  border: '2px solid #22c55e',
};

// Error toast style (red accent)
const errorStyle = {
  ...toastStyle,
  background: '#7f1d1d', // Dark red

  border: '2px solid #ef4444',
};

// Warning toast style (yellow accent)
const warningStyle = {
  ...toastStyle,
  border: '2px solid #f59e0b',
};

export const notify = {
  // Added to Cart
  addToCart: () => {
    toast.success(`✓ Added to cart successfully!`, {
      style: successStyle,
      duration: 2000,
    });
  },

  // Deleted from Cart
  deleteFromCart: () => {
    toast(`Item removed from cart`, {
      style: errorStyle,
      duration: 2000,
    });
  },

  // Logged In
  login: () => {
    toast.success(`Welcome back !`, {
      style: successStyle,
      duration: 3000,
    });
  },

  // Logged Out
  logout: () => {
    toast('Logged out successfully', {
      style: toastStyle,
      duration: 2000,
    });
  },

  // Signup Success
  signup: () => {
    toast.success(`Welcome to the family!`, {
      style: successStyle,
      duration: 3000,
    });
  },

  // Error Notifications
  error: () => {
    toast.error(`Something went wrong`, {
      style: errorStyle,
      duration: 4000,
    });
  },



  // Info Notifications
  info: (message) => {
    toast(message, {
      style: toastStyle,
      duration: 3000,
    });
  },

}