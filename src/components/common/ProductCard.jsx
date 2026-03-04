// src/components/common/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../hooks/useCategories";
import { notify } from "../../utils/toasts";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const { getCategoryName } = useCategories();

  const categoryName = getCategoryName(product.category_id);
  const hasDiscount =
    product.listPrice &&
    parseFloat(product.listPrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(product.listPrice) - parseFloat(product.price)) /
          parseFloat(product.listPrice)) *
          100,
      )
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    addToCart({
      id: product.asin,
      name: product.title,
      price: parseFloat(product.price),
      image: product.imgUrl,
    });
  };

  return (
    <div className="bg-gray-200 rounded-lg border-2 border-gray-300 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link to={`/product/${product.asin}`} className="block">
        <div className="relative pb-[100%] overflow-hidden bg-gray-200">
          <img
            src={product.imgUrl}
            alt={product.title}
            className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Best Seller Badge */}
          {product.isBestSeller === "True" && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
              Best Seller
            </span>
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>

        <div className="p-4">
          {/* Category */}
          <span className="text-xs text-blue-600 hover:text-blue-800 mb-1 block">
            {categoryName}
          </span>

          {/* Title */}
          <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2 mb-2 min-h-10">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(parseFloat(product.stars))
                      ? "text-yellow-400"
                      : "text-white"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">
              ({product.reviews || "0"} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xl font-bold text-gray-900">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="ml-2 text-xs text-gray-500 line-through">
                  ${parseFloat(product.listPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              title="Add to cart"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
