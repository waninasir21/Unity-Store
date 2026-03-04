// src/pages/CategoryProducts.jsx
import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import ProductList from "../components/products/ProductList";
import ProductFilter from "../components/products/ProductFilter";
import CategorySidebar from "../components/products/CategorySidebar";
import Pagination from "../components/common/Pagination";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const location = useLocation();

  const {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    showingStart,
    showingEnd,
    totalProducts,
    setSelectedCategory,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    selectedRatings,
    setSelectedRatings,
    showBestSellersOnly,
    setShowBestSellersOnly,
  } = useProducts();

  const { getCategoryById, loading: categoriesLoading } = useCategories();
  const category = getCategoryById(parseInt(categoryId));

  // Set category filter and read URL params
  useEffect(() => {
    setSelectedCategory(categoryId);

    const params = new URLSearchParams(location.search);

    // Price range
    const minPrice = params.get("minPrice");
    const maxPrice = params.get("maxPrice");
    setPriceRange({
      min: minPrice || "",
      max: maxPrice || "",
    });

    // Ratings
    const ratings = params.get("ratings")?.split(",").map(Number) || [];
    setSelectedRatings(ratings);

    // Best seller
    const bestSeller = params.get("bestSeller");
    setShowBestSellersOnly(bestSeller === "true");

    return () => setSelectedCategory("all");
  }, [
    categoryId,
    location.search,
    setSelectedCategory,
    setPriceRange,
    setSelectedRatings,
    setShowBestSellersOnly,
  ]);

  if (categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Category Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The category you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm">
        <span className="text-gray-600">Products</span>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-900 font-medium">
          {category.category_name}
        </span>
      </div>

      {/* Category Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {category.category_name}
        </h1>
      </div>

      {/* Search and Filter Bar */}
      <ProductFilter
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalProducts={totalProducts}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <CategorySidebar />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <ProductList products={products} loading={loading} error={error} />

          {!loading && !error && totalProducts > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                showingStart={showingStart}
                showingEnd={showingEnd}
                totalItems={totalProducts}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
