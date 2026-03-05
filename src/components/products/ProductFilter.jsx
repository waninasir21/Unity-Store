import React from "react";
import { Search } from "lucide-react";

const ProductFilter = ({
  sortBy,
  onSortChange,
  onSearchChange,
  searchQuery,
  totalProducts,
}) => {
  return (
    <div className="bg-gray-200 rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <p className="p-2">Sort By</p>
        {/* Sort */}
        <div className="md:w-64">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="featured">Featured</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="bestselling">Best Selling</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || sortBy !== "featured") && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>

          {sortBy !== "featured" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Sort: {sortBy.replace("_", " ")}
              <button
                onClick={() => onSortChange("featured")}
                className="ml-2 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
