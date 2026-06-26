"use client";

import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

export default function ProductGrid({
  products = [],
  loading = false,
  skeletonCount = 8,
}) {
  // Loading State
  if (loading) {
    return (
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          gap-4
          md:gap-6
        "
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Empty State
  if (!products.length) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800">
            No Products Found
          </h2>

          <p className="mt-3 text-gray-500">
            We couldn't find any products matching this concern.
          </p>
        </div>
      </div>
    );
  }

  // Products Grid
  return (
    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-4
        md:gap-6
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
}