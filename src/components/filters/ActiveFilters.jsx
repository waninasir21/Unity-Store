import React from "react";

const ActiveFilters = ({
  priceRange,
  selectedRatings,
  showBestSellersOnly,
  searchQuery,
  sortBy,
  onClearSearch,
  onClearSort,
  onClearAll,
}) => {
  const hasFilters =
    priceRange.min ||
    priceRange.max ||
    selectedRatings.length > 0 ||
    showBestSellersOnly ||
    searchQuery ||
    sortBy !== "featured";

  if (!hasFilters) return null;

  return (
    <div className="mb-4 pb-4 border-b">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-gray-500">Active Filters:</h4>
        <button
          onClick={onClearAll}
          className="text-xs text-gray-500 p-0.5 rounded border border-gray-500 bg-gray-300 hover:bg-red-500 hover:text-white hover:scale-105 transition-all"
        >
          Clear All
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {priceRange.min && priceRange.max && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            ${priceRange.min} - ${priceRange.max}
          </span>
        )}
        {selectedRatings.map((rating) => (
          <span
            key={rating}
            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
          >
            {rating}+ Stars
          </span>
        ))}
        {showBestSellersOnly && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Best Sellers
          </span>
        )}
        {searchQuery && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Search: "{searchQuery}"
          </span>
        )}
        {sortBy !== "featured" && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Sort: {sortBy.replace("_", " ")}
          </span>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
