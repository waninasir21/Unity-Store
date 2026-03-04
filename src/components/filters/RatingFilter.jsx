// src/components/filters/RatingFilter.jsx
import React from "react";
import { Star } from "lucide-react";

const RatingFilter = ({ selectedRatings, setSelectedRatings }) => {
  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating],
    );
  };

  return (
    <div className="mb-6">
      <h4 className="font-medium text-sm mb-2">Select Rating</h4>
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <label
            key={rating}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedRatings.includes(rating)}
              onChange={() => handleRatingChange(rating)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center">
              {[...Array(rating)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < rating
                      ? "fill-amber-400 text-amber-300"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="ml-2">{rating}+ Stars</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RatingFilter;
