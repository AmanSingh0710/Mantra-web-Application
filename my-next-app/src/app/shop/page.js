"use client";

import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import Link from "next/link";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await fetchFromAPI("/products");
                const safeProducts = res?.products || [];
                setProducts(Array.isArray(safeProducts) ? safeProducts : []);
            } catch (err) {
                console.log(err);
                setError("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    // Helper function to render star arrays dynamically based on rating data
    const renderStars = (rating = 0) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<FaStar key={i} className="text-amber-500 text-xs" />);
            } else if (rating >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} className="text-amber-500 text-xs" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-gray-300 text-xs" />);
            }
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm text-center max-w-md">
                    <p className="font-bold text-lg mb-1">Oops!</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 antialiased py-6 px-3 sm:px-6 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header ribbon summary */}
                <div className="flex justify-between items-baseline border-b border-gray-200 pb-4 mb-6">
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
                        Trending Products
                    </h1>
                    <span className="text-xs sm:text-sm text-gray-500 font-medium">
                        Showing {products.length} items
                    </span>
                </div>

                {/* 🌟 FULLY RESPONSIVE BREAKPOINT GRID GRID SYSTEM */}
                {/* 2 Columns on mobile, 3 on tablets, 4 on small laptops, 5 on wide monitors */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((product) => {
                            const salePrice = product.price || 0;
                            const discountAmount = product.discountAmount || 0;
                            const discountType = product.discountType || "Flat"; // "Percent" or "Flat"

                            let originalPrice = salePrice;
                            let dynamicDiscountPercentage = 0;

                            // 🌟 2. CALCULATE ORIGINAL PRICE & PERCENTAGE DYNAMICALLY
                            if (discountAmount > 0) {
                                if (discountType === "Percent") {
                                    dynamicDiscountPercentage = discountAmount;
                                    // Reverse calculation to find original price if your backend only stores the final sale price
                                    originalPrice = Math.round((salePrice * 100) / (100 - discountAmount));
                                } else {
                                    // If it's a Flat discount (e.g., ₹100 off), calculate the original price first
                                    originalPrice = salePrice + discountAmount;
                                    dynamicDiscountPercentage = Math.round((discountAmount / originalPrice) * 100);
                                }
                            }

                            return (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col overflow-hidden group"
                                >
                                    {/* Product Image Area */}
                                    <Link href={`/product/${product._id}`} className="relative block bg-gray-50 p-4 aspect-square flex items-center justify-center overflow-hidden border-b border-gray-50">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-contain max-h-full w-auto mix-blend-multiply group-hover:scale-105 transition duration-300"
                                            loading="lazy"
                                        />
                                        {/* 🌟 3. CONDITIONALLY RENDER DYNAMIC DISCOUNT PILL */}
                                        {dynamicDiscountPercentage > 0 && (
                                            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
                                                {dynamicDiscountPercentage}% OFF
                                            </div>
                                        )}
                                    </Link>

                                    {/* Product Meta Content */}
                                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">

                                        <div className="space-y-1">
                                            {/* Category Tag */}
                                            <p className="text-[10px] font-bold tracking-wider text-amber-600 uppercase truncate">
                                                {product.category || "Premium Edit"}
                                            </p>

                                            {/* Dynamic Title (Limits text to 2 lines like Amazon/Flipkart layouts) */}
                                            <Link href={`/product/${product._id}`} className="block">
                                                <h2 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-amber-600 transition tracking-tight leading-tight">
                                                    {product.name}
                                                </h2>
                                            </Link>
                                        </div>

                                        {/* Dynamic Star Rating String Row */}
                                        <div className="flex items-center space-x-1">
                                            <div className="flex items-center">
                                                {renderStars(product.rating)}
                                            </div>
                                            {product.numRatings > 0 && (
                                                <span className="text-[10px] text-gray-400 font-semibold">
                                                    ({Number(product.numRatings).toLocaleString()})
                                                </span>
                                            )}
                                        </div>

                                        {/* Dynamic Price Calculations Blocks */}
                                        <div className="pt-1">
                                            <div className="flex items-baseline flex-wrap gap-1">
                                                <span className="text-base font-bold text-gray-900">
                                                    ₹{salePrice.toLocaleString("en-IN")}
                                                </span>
                                                {discountAmount > 0 && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        ₹{originalPrice.toLocaleString("en-IN")}
                                                    </span>
                                                )}
                                            </div>
                                            {/* Stock Alert Label */}
                                            {product.stock <= 0 ? (
                                                <p className="text-[10px] font-bold text-red-600 mt-0.5">Out of stock</p>
                                            ) : product.stock < 5 ? (
                                                <p className="text-[10px] font-bold text-orange-600 mt-0.5">Only {product.stock} left!</p>
                                            ) : (
                                                <p className="text-[10px] font-medium text-green-600 mt-0.5">In Stock</p>
                                            )}
                                        </div>

                                        {/* Premium CTA Button */}
                                        <Link
                                            href={`/product/${product._id}`}
                                            className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 block text-center font-semibold text-xs py-2 rounded-lg transition shadow-sm"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full bg-white p-12 text-center rounded-xl border border-gray-100 shadow-sm text-gray-400 font-medium">
                            No products found matching the database collection profile.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}