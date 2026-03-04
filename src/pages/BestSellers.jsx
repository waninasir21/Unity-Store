// src/pages/BestSellers.jsx
import React, { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/common/ProductCard";
import Pagination from "../components/common/Pagination";
import PageHeader from "../components/common/PageHeader";
import { Award } from "lucide-react";
import bestSeller from "../assets/bestSeller.jpg";

const BestSellers = () => {
  const { getBestSellers, loading } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);

  const allBestSellers = getBestSellers();

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allBestSellers.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(allBestSellers.length / productsPerPage);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Best Sellers"
        subtitle="Our most popular products loved by customers"
        icon={<Award size={48} />}
        bgImage={bestSeller}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Products Grid */}
        {allBestSellers.length > 0 ? (
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
                    allBestSellers.length,
                  )}
                  totalItems={allBestSellers.length}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No best sellers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
