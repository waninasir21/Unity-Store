// src/components/filters/PriceFilter.jsx
import React from "react";

const PriceFilter = ({ priceRange, setPriceRange }) => {
  const quickRanges = [
    { label: "Under $25", min: 0, max: 25 },
    { label: "$25 - $50", min: 25, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $200", min: 100, max: 200 },
    { label: "$200 - $500", min: 200, max: 500 },
    { label: "$500 - $1000", min: 500, max: 1000 },
    { label: "$1000 - $5000", min: 1000, max: 5000 },
    { label: "More than $5000", min: 5000, max: 10000 },
  ];

  return (
    <div className="mb-6">
      <h4 className="font-medium text-sm mb-2">Select Price Range</h4>
      <div className="grid grid-cols-2 gap-2">
        {quickRanges.map((range) => (
          <button
            key={range.label}
            onClick={() =>
              setPriceRange({
                min: range.min.toString(),
                max: range.max.toString(),
              })
            }
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-blue-400 rounded transition-colors"
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriceFilter;
