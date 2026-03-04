// src/pages/NewArrivals.jsx
import React, { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/common/ProductCard";
import Pagination from "../components/common/Pagination";
import PageHeader from "../components/common/PageHeader";
import newArrivals from "../assets/newArrivals.jpg";
import { Sparkles } from "lucide-react";

const NewArrivals = () => {
  const { getNewArrivals, loading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const allNewArrivals = getNewArrivals().slice(0, 200);

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allNewArrivals.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(allNewArrivals.length / productsPerPage);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="New Arrivals"
        subtitle="Fresh products just added to our collection"
        icon={<Sparkles size={48} />}
        bgImage={newArrivals}
        className="bg-cover bg-center"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Products Grid */}
        {allNewArrivals.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product.asin} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showingStart={indexOfFirstProduct + 1}
                  showingEnd={Math.min(
                    indexOfLastProduct,
                    allNewArrivals.length,
                  )}
                  totalItems={allNewArrivals.length}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No new arrivals found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;
