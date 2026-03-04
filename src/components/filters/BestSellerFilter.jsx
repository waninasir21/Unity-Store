// src/components/filters/BestSellerFilter.jsx
import React from "react";

const BestSellerFilter = ({ showBestSellersOnly, setShowBestSellersOnly }) => {
  return (
    <div className="mb-6">
      <h4 className="font-medium text-sm mb-2">Best Seller</h4>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={showBestSellersOnly}
          onChange={(e) => setShowBestSellersOnly(e.target.checked)}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <span>Best Sellers Only</span>
      </label>
    </div>
  );
};

export default BestSellerFilter;
