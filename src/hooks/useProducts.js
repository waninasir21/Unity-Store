// src/hooks/useProducts.js
import { useState, useEffect} from "react";
import productsData from "../data/products.json";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filter states - use strings for price to match URL params
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" }); // Changed to strings
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBestSellersOnly, setShowBestSellersOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState([]);

  // Load all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const productsArray = Array.isArray(productsData)
          ? productsData
          : productsData.products || [];

        setAllProducts(productsArray);
        setProducts(productsArray.slice(0, productsPerPage));
        setFilteredProducts(productsArray);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productsPerPage]);

  // Apply filters and sorting
  useEffect(() => {
    if (allProducts.length === 0) return;

    let result = [...allProducts];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category_id?.toString() === selectedCategory.toString());
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p && p.title && p.title.toLowerCase().includes(query),
      );
    }

    // Price filter - handle string values
    if (priceRange.min || priceRange.max) {
      result = result.filter((p) => {
        if (!p || !p.price) return false;
        const price = parseFloat(p.price);
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      result = result.filter((p) => {
        if (!p || !p.stars) return false;
        const productRating = Math.floor(parseFloat(p.stars));
        return selectedRatings.includes(productRating);
      });
    }

    // Best sellers filter
    if (showBestSellersOnly) {
      result = result.filter((p) => p && p.isBestSeller === "True");
    }

    // In stock filter
    if (showInStockOnly) {
      result = result.filter((p) => p && p.inStock !== false);
    }

    // Sorting
    switch (sortBy) {
      case "price_low":
        result.sort(
          (a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0),
        );
        break;
      case "price_high":
        result.sort(
          (a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0),
        );
        break;
      case "rating":
        result.sort(
          (a, b) => parseFloat(b.stars || 0) - parseFloat(a.stars || 0),
        );
        break;
      case "bestselling":
        result.sort(
          (a, b) =>
            parseInt(b.boughtInLastMonth || 0) -
            parseInt(a.boughtInLastMonth || 0),
        );
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [
    allProducts,
    selectedCategory,
    searchQuery,
    selectedRatings,
    priceRange,
    sortBy,
    showBestSellersOnly,
    showInStockOnly,
  ]);

  // Update displayed products when page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage, productsPerPage]);

  // ============= HELPER FUNCTIONS =============

  const getProductById = (id) => {
    return allProducts.find((product) => product && product.asin === id);
  };

  const getProductsByCategory = (categoryId) => {
    if (categoryId === "all") return allProducts;
    return allProducts.filter(
      (product) => product && product.category_id === categoryId.toString(),
    );
  };

  const getBestSellers = () => {
    return allProducts.filter(
      (product) => product && product.isBestSeller === "True",
    );
  };

  const getNewArrivals = () => {
    return allProducts.filter(
      (product) =>
        product && (parseFloat(product.stars) === 0 || product.reviews === "0"),
    );
  };

  const getSalesProducts = () => {
    return allProducts.filter((product) => {
      if (!product) return false;
      const price = parseFloat(product.price);
      const listPrice = parseFloat(product.listPrice);
      const hasDiscount = listPrice > price && listPrice > 0;
      if (!hasDiscount) return false;
      const discountPercentage = Math.round(((listPrice - price) / listPrice) * 100);
      return discountPercentage > 30;
    });
  };

  // Pagination controls
  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceRange({ min: "", max: "" }); // Reset to empty strings
    setSortBy("featured");
    setSearchQuery("");
    setShowBestSellersOnly(false);
    setShowInStockOnly(false);
    setSelectedRatings([]);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const showingStart =
    filteredProducts.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1;
  const showingEnd = Math.min(
    currentPage * productsPerPage,
    filteredProducts.length,
  );

  return {
    // Data
    products,
    allProducts,
    filteredProducts,
    loading,
    error,

    // Pagination
    currentPage,
    totalPages,
    productsPerPage,
    setProductsPerPage,
    goToPage,
    nextPage,
    prevPage,
    showingStart,
    showingEnd,
    hasMore: currentPage < totalPages,

    // Filters
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    showBestSellersOnly,
    setShowBestSellersOnly,
    showInStockOnly,
    setShowInStockOnly,
    selectedRatings,
    setSelectedRatings,
    resetFilters,

    // Helper Functions
    getProductById,
    getProductsByCategory,
    getBestSellers,
    getNewArrivals,
    getSalesProducts,

    // Stats
    totalProducts: filteredProducts.length,
  };
};