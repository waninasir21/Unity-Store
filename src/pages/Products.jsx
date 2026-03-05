import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductList from "../components/products/ProductList";
import ProductFilter from "../components/products/ProductFilter";
import CategorySidebar from "../components/products/CategorySidebar";
import Pagination from "../components/common/Pagination";

const Products = () => {
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
    setSelectedCategory,
  } = useProducts();

  // Read filters from URL on mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Reset category to 'all' when on products page
    setSelectedCategory("all");

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
  }, [
    location.search,
    setSelectedCategory,
    setPriceRange,
    setSelectedRatings,
    setShowBestSellersOnly,
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-600 mt-1">
          Browse our collection of quality products
        </p>
      </div>

      {/* Search and Sort By Bar */}
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
          {/* Products Grid */}
          <ProductList products={products} loading={loading} error={error} />

          {/* Pagination */}
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

export default Products;
