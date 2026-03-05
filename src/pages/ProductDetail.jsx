import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { getProductById, loading } = useProducts();
  const { getCategoryById } = useCategories();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = getProductById(id);
  const category = product
    ? getCategoryById(parseInt(product.category_id))
    : null;

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product)
    return <div className="text-center py-12">Product not found</div>;

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

  const handleAddToCart = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    addToCart(
      {
        id: product.asin,
        name: product.title,
        price: parseFloat(product.price),
        image: product.imgUrl,
      },
      quantity,
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <span className="mx-2 text-gray-400">›</span>
        <Link to="/products" className="text-blue-600 hover:underline">
          Products
        </Link>
        {category && (
          <>
            <span className="mx-2 text-gray-400">›</span>
            <Link
              to={`/category/${category.id}`}
              className="text-blue-600 hover:underline"
            >
              {category.category_name}
            </Link>
          </>
        )}
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-600">
          {product.title.substring(0, 50)}...
        </span>
      </div>

      {/* Product Main Section */}
      <div className="bg-gray-200 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 p-8 bg-gray-200">
            <img
              src={product.imgUrl}
              alt={product.title}
              className="w-full h-auto object-contain max-h-96"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-8">
            {/* Category Tag */}
            {category && (
              <Link
                to={`/category/${category.id}`}
                className="inline-block mb-2 text-sm text-blue-600 hover:text-blue-800"
              >
                {category.category_name}
              </Link>
            )}

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(parseFloat(product.stars))
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.stars} out of 5 stars ({product.reviews || "0"}{" "}
                reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="ml-3 text-lg text-gray-500 line-through">
                      ${parseFloat(product.listPrice).toFixed(2)}
                    </span>
                    <span className="ml-3 bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/*info*/}
            <div className="mb-6 flex flex-col items-start">
              <p className="text-sm text-gray-600 mt-1">
                {product.boughtInLastMonth}+ bought in last month
              </p>
              <a
                href={product.productURL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center mt-4 text-blue-600 hover:text-blue-800"
              >
                Learn more ↗
              </a>
            </div>
            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity:
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border rounded-l-lg hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 px-3 py-1 border-t border-b text-center overflow-hidden"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border rounded-r-lg hover:bg-gray-100 "
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium`}
            >
              {!currentUser ? "Login to Add to Cart" : "Add to Cart"}
            </button>
            {addedToCart}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
