import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Menu, CircleUser } from "lucide-react";
import logo from "../../assets/icon.jpg";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 ">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl flex items-center font-bold text-red-500"
          >
            <img
              src={logo}
              alt="Unity Store Logo"
              className="h-8 w-8 mr-2 inline-block"
            />{" "}
            Unity Store
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center text-xl space-x-8">
            <Link to="/" className="text-gray-900 hover:text-red-500">
              Home
            </Link>
            <Link to="/products" className="text-gray-900 hover:text-red-500">
              Products
            </Link>

            {/* User Menu */}
            {currentUser ? (
              <div className="relative inline-block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1text-gray-900 hover:text-red-500"
                >
                  <span>{currentUser.username}</span>

                  <CircleUser className="w-6 h-6" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-900"
          >
            <CircleUser className="w-8 h-8" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>

            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/my-orders"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 py-2">
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
