"use client";

export default function ProductSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      
      {/* Product Image */}
      <div className="aspect-square bg-gray-200"></div>

      {/* Product Details */}
      <div className="p-4">

        {/* Product Name */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-4 rounded-full bg-gray-200"></div>
          <div className="h-4 w-10 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-14 bg-gray-200 rounded"></div>
        </div>

        {/* Category */}
        <div className="h-3 w-24 bg-gray-200 rounded"></div>

      </div>
    </div>
  );
}