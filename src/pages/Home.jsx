import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import ProductCard from "../components/common/ProductCard";
import { Truck, LockKeyhole, Handshake, ArrowRight } from "lucide-react";
import bgImage from "../assets/home.jpg";

const Home = () => {
  const { products, getBestSellers, loading } = useProducts();
  const { categories } = useCategories();

  const bestSellers = getBestSellers().slice(0, 4);
  const recentProducts = products.slice(0, 4);

  // Getting some featured categories
  const featuredCategories = categories.slice(0, 6);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 ">
      {/* Hero Section */}
      <div
        className="text-gray-900 bg-cover bg-center h-83 relative flex items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="container mx-auto flex justify-center flex-col px-4 text-gray-900">
          <div className="max-w-2xl  ">
            <h1 className="text-4xl md:text-5xl text-red-500 font-bold mb-4">
              Welcome to Unity Store
            </h1>
            <p className="text-xl mb-8">
              Discover amazing products at great prices. Shop from thousands of
              items across hundreds of categories.
            </p>
            <Link
              to="/products"
              className="inline-block bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 hover:scale-105 hover:transition-transform"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-red-500 pb-2 w-max">
          Shop by Top Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-300 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-2">🛍️</div>
              <h3 className="text-sm font-medium text-gray-900">
                {category.category_name}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-red-500 pb-2 w-max">
              Best Sellers
            </h2>
            <Link
              to="/best-sellers"
              className="inline-flex items-center text-red-500 font-semibold mb-6 hover:text-red-700"
            >
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.asin} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* New Arrivals */}
      {recentProducts.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-red-500 pb-2 w-max">
              New Arrivals
            </h2>
            <Link
              to="/best-sellers"
              className="inline-flex items-center text-red-500 font-semibold mb-6 hover:text-red-700"
            >
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <ProductCard key={product.asin} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="">
        <div className="">
          <div className="bg-gray-200 py-12 mx-auto px-4 grid grid-cols-3 md:grid-cols-3 gap-8 ">
            <div className="text-center">
              <div className=" flex justify-center mb-4">
                <Truck size={100} className="text-red-500" />
              </div>
              <h3 className="text-lg text-gray-800 font-semibold mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-400">On orders over $50</p>
            </div>
            <div className="text-center">
              <div className=" flex justify-center mb-4">
                <LockKeyhole size={100} className="text-red-500" />
              </div>
              <h3 className="text-lg text-gray-800 font-semibold mb-2">
                Secure Payment
              </h3>
              <p className="text-gray-400">100% secure transactions</p>
            </div>
            <div className="text-center">
              <div className=" flex justify-center mb-4">
                <Handshake size={100} className="text-red-500" />
              </div>
              <h3 className="text-lg text-gray-800 font-semibold mb-2">
                Easy Returns
              </h3>
              <p className="text-gray-400">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
