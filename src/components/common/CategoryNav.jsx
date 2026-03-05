import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { useCart } from "../../context/CartContext";
import {
  Sparkles,
  Award,
  BadgePercent,
  Gift,
  Menu,
  X,
  Search,
  MessageSquareMore,
  ShoppingCart,
} from "lucide-react";

const CategoryNav = () => {
  const { getCartCount } = useCart();
  const { categories, loading } = useCategories();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const cartCount = getCartCount();

  const isActive = (path) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  // Group categories by first letter for dropdown
  const groupedCategories = categories.reduce((acc, category) => {
    const firstLetter = category.category_name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(category);
    return acc;
  }, {});

  const sortedLetters = Object.keys(groupedCategories).sort();

  // Get main categories (indices 6-10 for display-for demo purposes)
  const mainCategories = categories.slice(6, 10);

  // Filter categories based on search
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = categories.filter((cat) =>
        cat.category_name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [searchTerm, categories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-12 animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-24"></div>
            <div className="hidden md:flex space-x-4 ml-8">
              <div className="h-4 bg-gray-600 rounded w-16"></div>
              <div className="h-4 bg-gray-600 rounded w-20"></div>
              <div className="h-4 bg-gray-600 rounded w-24"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center h-12 justify-between">
          <div className="flex items-center">
            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "categories" ? null : "categories",
                  )
                }
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  activeDropdown === "categories"
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <Menu
                  className={`w-5 h-5 text-red-500 transition-transform ${activeDropdown === "categories" ? "rotate-180" : ""}`}
                />
                <span>All Categories</span>
              </button>

              {/* Categories Dropdown Menu */}
              {activeDropdown === "categories" && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                  {/* Search in dropdown */}
                  <div className="p-3 border-b">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-sm text-gray-700 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                      />
                      <Search className="absolute left-2 top-2.5 w-4 h-4 text-red-400" />
                    </div>
                  </div>

                  {/* Categories List */}
                  <div className="max-h-96 overflow-y-auto">
                    {searchTerm ? (
                      // Search results
                      <div className="p-2">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((category) => (
                            <Link
                              key={category.id}
                              to={`/category/${category.id}`}
                              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                              onClick={() => {
                                setActiveDropdown(null);
                                setSearchTerm("");
                              }}
                            >
                              {category.category_name}
                            </Link>
                          ))
                        ) : (
                          <p className="px-3 py-2 text-sm text-gray-500">
                            No categories found
                          </p>
                        )}
                      </div>
                    ) : (
                      // Grouped categories
                      <div className="p-2">
                        {sortedLetters.map((letter) => (
                          <div key={letter} className="mb-3">
                            <h3 className="px-3 py-1 text-xs font-bold text-red-500 bg-gray-50 rounded sticky top-0">
                              {letter}
                            </h3>
                            {groupedCategories[letter].map((category) => (
                              <Link
                                key={category.id}
                                to={`/category/${category.id}`}
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {category.category_name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View All Link */}
                  <div className="p-3 border-t bg-gray-50">
                    <Link
                      to="/products"
                      className="block text-center text-sm text-blue-400 hover:text-blue-400 font-medium"
                      onClick={() => setActiveDropdown(null)}
                    >
                      View All Products
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Main Category Links with active state */}
            <div className="flex items-center space-x-1 ml-4 overflow-x-auto">
              {mainCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className={`px-3 py-2 text-sm whitespace-nowrap rounded-md transition-colors ${
                    isActive(`/category/${category.id}`)
                      ? "bg-blue-400 text-white font-medium"
                      : "hover:bg-gray-700"
                  }`}
                >
                  {category.category_name}
                </Link>
              ))}
            </div>
          </div>

          {/* Cart Icon for Desktop with active state */}
          <Link to="/cart" className="relative mr-2">
            <ShoppingCart
              className={`w-10 h-10 p-1 rounded-lg text-red-500 transition-colors ${
                isActive("/cart")
                  ? "text-blue-400 bg-blue-400"
                  : "text-red-500 hover:bg-gray-700"
              }`}
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-12">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isOpen ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              {isOpen ? (
                <X className="w-5 h-5 text-red-500" />
              ) : (
                <Menu className="w-5 h-5 text-red-500" />
              )}
              <span>Categories</span>
            </button>

            {/* Mobile Cart Icon with active state */}
            <Link to="/cart" className="relative">
              <ShoppingCart
                className={`w-8 h-8 text-red-500 transition-all duration-200 ${
                  isActive("/cart")
                    ? "text-blue-400 scale-110"
                    : "text-white hover:text-gray-300 hover:scale-110"
                }`}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Feature Links with active state */}
          <div className="grid grid-cols-5 gap-2 p-3 border-t border-gray-700">
            <Link
              to="/new-arrivals"
              className={`flex flex-col items-center py-2 rounded-md transition-colors ${
                isActive("/new-arrivals")
                  ? "text-blue-400 bg-gray-700 "
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Sparkles className="w-5 h-5 text-red-500" />
              <span className="text-xs mt-1">New Arrivals</span>
            </Link>
            <Link
              to="/best-sellers"
              className={`flex flex-col items-center py-2 rounded-md transition-colors ${
                isActive("/best-sellers")
                  ? "text-blue-400 bg-gray-700"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Award className="w-5 h-5 text-red-500" />
              <span className="text-xs mt-1">Best Sellers</span>
            </Link>
            <Link
              to="/sales"
              className={`flex flex-col items-center py-2 rounded-md transition-colors ${
                isActive("/sales")
                  ? "text-blue-400 bg-gray-700"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <BadgePercent className="w-5 h-5 text-red-500" />
              <span className="text-xs mt-1">Sales</span>
            </Link>
            <Link
              to="/gift-cards"
              className={`flex flex-col items-center py-2 rounded-md transition-colors ${
                isActive("/gift-cards")
                  ? "text-blue-400 bg-gray-700"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Gift className="w-5 h-5 text-red-500" />
              <span className="text-xs mt-1">Gift Cards</span>
            </Link>
            <Link
              to="/customer-service"
              className={`flex flex-col items-center py-2 rounded-md transition-colors ${
                isActive("/customer-service")
                  ? "text-blue-400 bg-gray-700"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <MessageSquareMore className="w-5 h-5 text-red-500" />
              <span className="text-xs mt-1">Customer Service</span>
            </Link>
          </div>

          {/* Mobile Menu with complete content */}
          {isOpen && (
            <div
              className="absolute left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-50"
              ref={mobileMenuRef}
            >
              {/* Search in mobile */}
              <div className="p-3 border-b border-gray-700">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Categories List */}
              <div className="max-h-96 overflow-y-auto">
                {searchTerm ? (
                  // Search results
                  <div className="p-2">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.id}`}
                          className="block px-4 py-3 text-sm text-white hover:bg-gray-700 border-b border-gray-700 last:border-b-0"
                          onClick={() => {
                            setIsOpen(false);
                            setSearchTerm("");
                          }}
                        >
                          {category.category_name}
                        </Link>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-gray-400">
                        No categories found
                      </p>
                    )}
                  </div>
                ) : (
                  // All categories
                  <div>
                    <Link
                      to="/products"
                      className="block px-4 py-3 text-sm text-yellow-400 hover:bg-gray-700 border-b border-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      All Products
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="block px-4 py-3 text-sm text-white hover:bg-gray-700 border-b border-gray-700 last:border-b-0"
                        onClick={() => setIsOpen(false)}
                      >
                        {category.category_name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Navigation - Desktop with active state */}
      <div className="bg-gray-700 text-sm hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 h-8">
            <Link
              to="/new-arrivals"
              className={`flex items-center transition-colors px-2 py-1 rounded ${
                isActive("/new-arrivals")
                  ? "text-white bg-blue-400"
                  : "text-gray-300 hover:text-white hover:bg-gray-600"
              }`}
            >
              <Sparkles size={16} className="mr-1 text-red-500" />
              New Arrivals
            </Link>
            <Link
              to="/best-sellers"
              className={`flex items-center transition-colors px-2 py-1 rounded ${
                isActive("/best-sellers")
                  ? "text-white bg-blue-400"
                  : "text-gray-300 hover:text-white hover:bg-gray-600"
              }`}
            >
              <Award size={16} className="mr-1 text-red-500" />
              Best Sellers
            </Link>
            <Link
              to="/sales"
              className={`flex items-center transition-colors px-2 py-1 rounded ${
                isActive("/sales")
                  ? "text-white bg-blue-400"
                  : "text-gray-300 hover:text-white hover:bg-gray-600"
              }`}
            >
              <BadgePercent size={16} className="mr-1 text-red-500" />
              Sales
            </Link>
            <Link
              to="/gift-cards"
              className={`flex items-center transition-colors px-2 py-1 rounded ${
                isActive("/gift-cards")
                  ? "text-white bg-blue-400"
                  : "text-gray-300 hover:text-white hover:bg-gray-600"
              }`}
            >
              <Gift size={16} className="mr-1 text-red-500" />
              Gift Cards
            </Link>
            <Link
              to="/customer-service"
              className={`flex items-center transition-colors px-2 py-1 rounded ml-auto ${
                isActive("/customer-service")
                  ? "text-white bg-blue-400"
                  : "text-gray-300 hover:text-white hover:bg-gray-600"
              }`}
            >
              <MessageSquareMore size={16} className="mr-1 text-red-500" />
              Customer Service
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
