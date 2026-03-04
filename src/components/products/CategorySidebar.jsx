// src/components/products/CategorySidebar.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import PriceFilter from "../filters/PriceFilter";
import RatingFilter from "../filters/RatingFilter";
import BestSellerFilter from "../filters/BestSellerFilter";
import ActiveFilters from "../filters/ActiveFilters";
import { Menu, SlidersHorizontal } from "lucide-react";

const CategorySidebar = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { categories, loading: categoriesLoading } = useCategories();
  const [categoriesList, setCategoriesList] = useState([]);

  const {
    priceRange,
    setPriceRange,
    selectedRatings,
    setSelectedRatings,
    setSelectedCategory,
    showBestSellersOnly,
    setShowBestSellersOnly,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    resetFilters,
  } = useProducts();

  // Load categories
  useEffect(() => {
    if (!categoriesLoading && categories.length > 0) {
      const sorted = [...categories].sort((a, b) =>
        a.category_name.localeCompare(b.category_name),
      );
      setCategoriesList(sorted);
    }
  }, [categories, categoriesLoading]);

  // Sync category from URL
  useEffect(() => {
    setSelectedCategory(categoryId || "all");
  }, [categoryId, setSelectedCategory]);

  // Load filters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setPriceRange({
      min: params.get("minPrice") || "",
      max: params.get("maxPrice") || "",
    });

    setSelectedRatings(
      params.get("ratings") ? params.get("ratings").split(",").map(Number) : [],
    );

    setShowBestSellersOnly(params.get("bestSeller") === "true");

    // These might be handled in ProductFilter, but include for completeness
    if (params.get("search")) setSearchQuery(params.get("search"));
    if (params.get("sort")) setSortBy(params.get("sort"));
  }, [
    location.search,
    setPriceRange,
    setSelectedRatings,
    setShowBestSellersOnly,
    setSearchQuery,
    setSortBy,
  ]);

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (priceRange.min) params.set("minPrice", priceRange.min);
    if (priceRange.max) params.set("maxPrice", priceRange.max);
    if (selectedRatings.length > 0)
      params.set("ratings", selectedRatings.join(","));
    if (showBestSellersOnly) params.set("bestSeller", "true");
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy !== "featured") params.set("sort", sortBy);

    const currentPath = categoryId ? `/category/${categoryId}` : "/products";
    navigate(`${currentPath}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    resetFilters();
    const currentPath = categoryId ? `/category/${categoryId}` : "/products";
    navigate(currentPath);
  };

  const clearSearch = () => {
    setSearchQuery("");
    applyFilters();
  };

  const clearSort = () => {
    setSortBy("featured");
    applyFilters();
  };

  if (categoriesLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 rounded-lg shadow-md p-4 sticky top-4 space-y-6 mb-4 pb-4 border-x border-gray-300">
      {/* Categories Section */}
      <div>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Menu className="w-5 h-5" />
          Categories
        </h3>

        <div className="space-y-1 max-h-60 overflow-y-auto overflow-x-hidden">
          <Link
            to="/products"
            className={`block px-3 py-2 rounded-md transition-colors text-sm ${
              !categoryId ? "bg-blue-400 text-white" : "hover:bg-gray-100"
            }`}
          >
            All Products
          </Link>

          {categoriesList.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={`block px-3 py-2 rounded-md transition-colors text-sm ${
                parseInt(categoryId) === category.id
                  ? "bg-blue-400 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="truncate">{category.category_name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div className="border-t pt-4">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </h3>
        <ActiveFilters
          priceRange={priceRange}
          selectedRatings={selectedRatings}
          showBestSellersOnly={showBestSellersOnly}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onClearSearch={clearSearch}
          onClearSort={clearSort}
          onClearAll={clearAllFilters}
        />
        <PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} />
        <RatingFilter
          selectedRatings={selectedRatings}
          setSelectedRatings={setSelectedRatings}
        />
        <BestSellerFilter
          showBestSellersOnly={showBestSellersOnly}
          setShowBestSellersOnly={setShowBestSellersOnly}
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={applyFilters}
            className="flex-1 bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors text-sm font-medium"
          >
            Apply Filters
          </button>
          <button
            onClick={clearAllFilters}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
