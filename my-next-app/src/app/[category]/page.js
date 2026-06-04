"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { fetchFromAPI , getImageUrl} from "@/utils/api";
import Link from "next/link";
import { FaStar, FaRegStar, FaStarHalfAlt, FaSpinner, FaBoxes } from "react-icons/fa";

export default function DynamicCategoryPage() {
    const params = useParams();
    const slug = params?.category;

    const [products, setProducts] = useState([]);
    const [categoryDisplayName, setCategoryDisplayName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Prevent redundant or infinite API loop calls on re-renders
    const lastFetchedSlug = useRef("");

    // Structured Lookup Dictionary for all Header navigation options
    const categoryLookup = {
        "shop": "all products",
        "skin": "skin",
        "bath-body": "bath & body",
        "hair": "hair",
        "men": "men",
        "women": "women",
        "wedding": "wedding edits",
        "combos": "combos",
        "story": "our story"
    };

    const mapSlugToBackendCategory = (urlSlug) => {
        if (!urlSlug) return "";
        const normalized = urlSlug.toLowerCase().trim();
        return categoryLookup[normalized] || decodeURIComponent(urlSlug).toLowerCase();
    };

    useEffect(() => {
        // Stop execution if there is no slug, or if we just fetched this exact category
        if (!slug || slug === lastFetchedSlug.current) return;

        const loadFilteredCollection = async () => {
            try {
                setLoading(true);
                setError("");

                // Lock this slug to prevent double-fetching
                lastFetchedSlug.current = slug;
                const targetCategory = mapSlugToBackendCategory(slug);

                // 1. Structural routing bypass for non-product layout paths
                if (targetCategory === "our story") {
                    setProducts([]);
                    setCategoryDisplayName("Our Story");
                    setLoading(false);
                    return;
                }

                // 2. Build optimized database query endpoints
                let endpoint = "/products";
                if (targetCategory !== "all products") {
                    endpoint = `/products?category=${encodeURIComponent(targetCategory)}`;
                }

                // 3. Fetch ONLY the needed data from the database server
                const res = await fetchFromAPI(endpoint);
                const fetchedProducts = res?.products || [];

                setProducts(fetchedProducts);

                // 4. Set beautiful dynamic display names
                if (fetchedProducts.length > 0 && fetchedProducts[0].category) {
                    setCategoryDisplayName(fetchedProducts[0].category);
                } else {
                    setCategoryDisplayName(
                        targetCategory.replace(/\b\w/g, (char) => char.toUpperCase())
                    );
                }
            } catch (err) {
                console.error("Dynamic loading error failed:", err);
                // Clear lock on error to allow manual retries/refreshes
                lastFetchedSlug.current = "";

                if (err.message?.includes("429") || String(err).includes("429")) {
                    setError("Too many requests. Your local API server is rate-limiting connections. Please wait a moment or restart your backend.");
                } else {
                    setError("Could not parse current collection records from cloud engine.");
                }
            } finally {
                setLoading(false);
            }
        };

        loadFilteredCollection();
    }, [slug]);

    const renderStars = (rating = 0) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<FaStar key={i} className="text-amber-500 text-[10px]" />);
            } else if (rating >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} className="text-amber-500 text-[10px]" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-stone-200 text-[10px]" />);
            }
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="flex flex-col items-center gap-3">
                    <FaSpinner className="animate-spin text-3xl text-amber-500" />
                    <p className="text-xs tracking-widest text-stone-500 uppercase font-bold animate-pulse">
                        Querying Live Database...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm text-center max-w-md">
                    <p className="font-bold text-base mb-1">Catalog Connection Failure</p>
                    <p className="text-xs font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 antialiased selection:bg-amber-100 pb-16">

            {/* 🌟 FULLY DYNAMIC EDITORIAL BANNER (Generates straight from your backend product properties) */}
            <section className="bg-white border-b border-stone-200/60 py-12 px-4 text-center mb-8">
                <div className="max-w-2xl mx-auto space-y-2">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-amber-600 uppercase block animate-fade-in">
                        Live Collection
                    </span>
                    <h1 className="text-2xl md:text-4xl font-serif tracking-tight text-stone-900 capitalize">
                        {categoryDisplayName}
                    </h1>
                    <div className="h-0.5 w-12 bg-amber-500 mx-auto my-3" />
                    <p className="text-xs md:text-sm text-stone-500 font-medium">
                        Discover our curated lineup of high-performance items under our {categoryDisplayName} category ecosystem.
                    </p>
                </div>
            </section>

            {/* Main Content Interface Container */}
            <div className="max-w-7xl mx-auto px-2 sm:px-6 md:px-8">

                {/* Dynamic Data Summary Metrics Ribbon */}
                <div className="flex justify-between items-center border-b border-stone-200/80 pb-3 mb-5 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        Mantra Catalog Profile
                    </span>
                    <span className="text-[11px] md:text-xs text-stone-600 font-bold bg-white px-3 py-1 border border-stone-200 rounded-full shadow-xs">
                        {products.length} Real-time Records
                    </span>
                </div>

                {/* 🌟 2-COLUMN MOBILE TO 5-COLUMN MONITOR FLUID ADAPTIVE GRID GRID */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-5">
                        {products.map((product) => {
                            const salePrice = product.price || 0;
                            const discountAmount = product.discountAmount || 0;
                            const discountType = product.discountType || "Flat";

                            let originalPrice = salePrice;
                            let dynamicDiscountPercentage = 0;

                            if (discountAmount > 0) {
                                if (discountType === "Percent") {
                                    dynamicDiscountPercentage = discountAmount;
                                    originalPrice = Math.round((salePrice * 100) / (100 - discountAmount));
                                } else {
                                    originalPrice = salePrice + discountAmount;
                                    dynamicDiscountPercentage = Math.round((discountAmount / originalPrice) * 100);
                                }
                            }

                            return (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-xl border border-stone-200/60 shadow-sm hover:shadow-md transition duration-200 flex flex-col overflow-hidden group"
                                >
                                    {/* Dynamic Product Image Component Base Layout */}
                                    <Link
                                        href={`/product/${product._id}`}
                                        className="relative block bg-stone-50/50 p-3 sm:p-4 aspect-square flex items-center justify-center overflow-hidden border-b border-stone-100"
                                    >
                                        <img
                                             src={getImageUrl(product.thumbnail)}
                                            alt={product.name}
                                            className="object-contain max-h-full w-auto mix-blend-multiply transform group-hover:scale-105 transition duration-300 ease-out"
                                            loading="lazy"
                                        />

                                        {dynamicDiscountPercentage > 0 && (
                                            <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs tracking-wider">
                                                {dynamicDiscountPercentage}% OFF
                                            </div>
                                        )}
                                    </Link>

                                    {/* Context and Copy Specifications Wrapper */}
                                    <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
                                        <div className="space-y-1">
                                            <p className="text-[9px] sm:text-[10px] font-bold tracking-wider text-amber-600 uppercase truncate">
                                                {product.category}
                                            </p>

                                            <Link href={`/product/${product._id}`} className="block">
                                                <h2 className="text-xs sm:text-sm font-semibold text-stone-800 line-clamp-2 group-hover:text-amber-600 transition tracking-tight leading-tight min-h-[2rem]">
                                                    {product.name}
                                                </h2>
                                            </Link>
                                        </div>

                                        {/* Interactive Micro-Rating Metrics */}
                                        <div className="flex items-center space-x-1">
                                            <div className="flex items-center gap-0.5">
                                                {renderStars(product.rating)}
                                            </div>
                                            {product.numRatings > 0 && (
                                                <span className="text-[9px] sm:text-[10px] text-stone-400 font-bold shrink-0">
                                                    ({Number(product.numRatings).toLocaleString()})
                                                </span>
                                            )}
                                        </div>

                                        {/* Adaptive Pricing Metric Indicators */}
                                        <div className="pt-0.5">
                                            <div className="flex items-baseline flex-wrap gap-1">
                                                <span className="text-sm sm:text-base font-extrabold text-stone-900">
                                                    ₹{salePrice.toLocaleString("en-IN")}
                                                </span>
                                                {discountAmount > 0 && (
                                                    <span className="text-[10px] sm:text-xs text-stone-400 line-through font-medium">
                                                        ₹{originalPrice.toLocaleString("en-IN")}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Client Inventory Level Monitoring Badges */}
                                            {product.stock <= 0 ? (
                                                <p className="text-[9px] sm:text-[10px] font-bold text-red-600 mt-0.5">Out of stock</p>
                                            ) : product.stock < 5 ? (
                                                <p className="text-[9px] sm:text-[10px] font-bold text-orange-600 mt-0.5">Only {product.stock} left!</p>
                                            ) : (
                                                <p className="text-[9px] sm:text-[10px] font-bold text-green-600 mt-0.5">In Stock</p>
                                            )}
                                        </div>

                                        {/* Premium Activation CTA */}
                                        <Link
                                            href={`/product/${product._id}`}
                                            className="w-full bg-amber-400 hover:bg-amber-500 text-stone-950 block text-center font-bold text-[11px] sm:text-xs py-2 rounded-lg transition duration-150 shadow-xs"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty Database State UI Layer */
                    <div className="max-w-md mx-auto bg-white border border-stone-200/60 p-12 text-center rounded-xl shadow-xs text-stone-400 space-y-3 mt-12">
                        <FaBoxes className="mx-auto text-3xl text-stone-300" />
                        <p className="text-sm font-semibold text-stone-600">No live products found</p>
                        <p className="text-xs text-stone-400 max-w-xs mx-auto">
                            There are currently no catalog objects published under the query string classification parameter.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}