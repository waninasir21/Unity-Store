// src/components/cart/CartItem.jsx
import React from "react";
import { Link } from "react-router-dom";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      {/* Product Image */}
      <Link to={`/product/${item.id}`} className="shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-contain bg-gray-50 rounded border"
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${item.id}`}
          className="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
        >
          {item.name}
        </Link>

        <p className="text-gray-600 mt-1">${item.price.toFixed(2)} each</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="px-3 py-1 hover:bg-gray-100 rounded-l-md transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-3 py-1 border-x min-w-10 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-3 py-1 hover:bg-gray-100 rounded-r-md transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            aria-label="Remove item"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Item Total */}
      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-gray-900">
          ${itemTotal.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          ${item.price.toFixed(2)} each
        </p>
      </div>
    </div>
  );
};

export default CartItem;
