"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchFromAPI } from "@/utils/api";
import { FaShoppingBag, FaBolt, FaStar, FaShieldAlt, FaTruck, FaUndo, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetchFromAPI(`/products/${id}`);
                if (res && res.data) {
                    setProduct(res.data);
                    setSelectedImage(res.data.image);
                } else if (res) {
                    setProduct(res);
                    setSelectedImage(res.image);
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                toast.error("Failed to load product details");
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const getImageUrl = (imgName) => {
        if (!imgName) return "";
        if (imgName.startsWith("http://") || imgName.startsWith("https://") || imgName.startsWith("/")) {
            return imgName;
        }
        const cleanPath = imgName.replace(/\\/g, "/");
        return cleanPath.startsWith("uploads/")
            ? `${BASE_URL}/${cleanPath}`
            : `${BASE_URL}/uploads/${cleanPath}`;
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    const handleQuantityChange = (type) => {
        if (type === "dec" && quantity > 1) setQuantity(prev => prev - 1);
        if (type === "inc" && quantity < (product.stock || 10)) setQuantity(prev => prev + 1);
    };


    // 🌟 ROBUST CART SYNC SYSTEM (Token Authentication Problem Solved)
    const addToCart = async (redirectToCheckout = false) => {
        setIsAdding(true);

        const targetProductId = product?._id || product?.id || id;
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

        if (!token) {
            toast.error("login before add to cart");
            router.push("/login");
            setIsAdding(false);
            return;
        }

        if (!targetProductId || targetProductId.length !== 24) {
            toast.error("Invalid product tracking data. Please refresh.");
            setIsAdding(false);
            return;
        }

        try {
            // Direct Native Fetch Call to bypass custom Axios/Fetch wrapper header-dropping bugs
            const response = await fetch(`${BASE_URL}/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: targetProductId,
                    quantity: quantity,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                if (redirectToCheckout) {
                    toast.success("Redirecting to checkout...");
                    router.push("/cart?checkout=true");
                } else {
                    toast.success("Shopping Bag mein add ho gaya! 🎉");
                    router.push("/cart");
                }
            } else {
                toast.error(result.message || "Cart update fail ho gayi.");
            }
        } catch (err) {
            console.error("Cart error trace:", err);
            toast.error("Network error: Could not complete cart sync.");
        } finally {
            setIsAdding(false);
        }
    };

    const renderStars = (rating = 0) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<FaStar key={i} className="text-amber-500 text-sm" />);
            } else if (rating >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} className="text-amber-500 text-sm" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
            }
        }
        return stars;
    };

    // 🌟 DYNAMIC PRICES CONTROLLED BY ADMIN PANEL DATA
    const productPrice = product.price || product.unitPrice || 0;
    
    // Agar admin ne database se product.mrp bheja hai toh use karein, nahi toh selling price ko hi dikhayein
    const adminMRP = product.mrp || productPrice; 
    
    // Dynamic percentage calculation formula logic
    const dynamicDiscount = adminMRP > productPrice 
        ? Math.round(((adminMRP - productPrice) * 100) / adminMRP) 
        : 0;

    return (
        <main className="min-h-screen bg-white text-gray-900 antialiased">
            <Toaster position="top-center" />
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">

                {/* Main Dynamic Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT COLUMN: MULTIMEDIA DISPLAY CAROUSEL */}
                    <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 h-fit">
                        <div className="border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-center p-4 overflow-hidden aspect-square shadow-sm">
                            <img
                                src={getImageUrl(selectedImage || product.image)}
                                alt={product.name}
                                className="object-contain max-h-[450px] w-full mix-blend-multiply hover:scale-105 transition duration-300"
                            />
                        </div>

                        {/* Interactive Secondary Thumbnail Gallery Lineup */}
                        {product.images && product.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                <button
                                    onClick={() => setSelectedImage(product.image)}
                                    className={`w-20 h-20 border-2 rounded-md p-1 bg-white flex-shrink-0 ${selectedImage === product.image ? 'border-amber-500' : 'border-gray-200'}`}
                                >
                                    <img src={getImageUrl(product.image)} className="w-full h-full object-contain mix-blend-multiply" alt="primary thumb" />
                                </button>
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-20 h-20 border-2 rounded-md p-1 bg-white flex-shrink-0 ${selectedImage === img ? 'border-amber-500' : 'border-gray-200'}`}
                                    >
                                        <img src={getImageUrl(img)} className="w-full h-full object-contain mix-blend-multiply" alt="gallery thumb" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: CORE PRODUCT INSIGHTS */}
                    <div className="lg:col-span-7 space-y-6">
                        <div>
                            <span
                                onClick={() => {
                                    if (product.category) {
                                        router.push(`/products?category=${encodeURIComponent(product.category)}`);
                                    }
                                }}
                                className="text-xs uppercase tracking-wider text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded cursor-pointer hover:bg-amber-100 hover:text-amber-700 transition-all inline-block"
                            >
                                {product.category || "Premium Segment"}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-semibold mt-3 tracking-tight text-gray-900 uppercase">
                                {product.name}
                            </h1>
                        </div>

                        {/* Ratings & Metrics Dashboard Line */}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <div className="bg-green-600 text-white flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                                {product.rating ? Number(product.rating).toFixed(1) : "0.0"} <FaStar className="text-[10px]" />
                            </div>

                            <div className="flex items-center space-x-0.5">
                                {renderStars(product.rating)}
                            </div>

                            {(product.numRatings > 0 || product.numReviews > 0) ? (
                                <span className="text-gray-500 font-medium hover:underline cursor-pointer">
                                    {Number(product.numRatings || 0).toLocaleString()} Ratings &{' '}
                                    {Number(product.numReviews || 0).toLocaleString()} Reviews
                                </span>
                            ) : (
                                <span className="text-gray-400 text-xs italic">
                                    No customer metrics submitted yet. Be the first to review!
                                </span>
                            )}
                        </div>

                        <hr className="border-gray-100" />

                        {/* Pricing Layout Breakdown - 🎯 NOW FULLY DYNAMIC CONTROLLED BY ADMIN */}
                        <div className="space-y-1">
                            <div className="flex items-baseline space-x-3">
                                <span className="text-3xl font-bold text-gray-900">₹{productPrice}</span>
                                
                                {dynamicDiscount > 0 && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">₹{adminMRP}</span>
                                        <span className="text-green-600 font-semibold text-lg">{dynamicDiscount}% off</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">Inclusive of all structural domestic taxes</p>
                        </div>

                        {/* Inventory Threshold Flags */}
                        <div>
                            {product.stock > 0 ? (
                                <p className="text-sm font-semibold text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full">
                                    ✔ Available Storage Stock ({product.stock} items remaining)
                                </p>
                            ) : (
                                <p className="text-sm font-semibold text-red-600 bg-red-50 w-fit px-3 py-1 rounded-full">
                                    𐄂 Warehouse Stock Depleted
                                </p>
                            )}
                        </div>

                        {/* Product Specifications Layout */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900 text-sm tracking-wide uppercase">Product Description</h3>
                            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                                {product.description || "No specific detailed descriptions uploaded for this inventory entry."}
                            </p>
                        </div>

                        {/* Dynamic Item Quantity Controller */}
                        {product.stock > 0 && (
                            <div className="flex items-center space-x-4 pt-2">
                                <span className="text-sm font-semibold text-gray-700">Quantity Selection:</span>
                                <div className="flex items-center border border-gray-300 rounded-md bg-gray-50 shadow-sm overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange("dec")}
                                        className="px-3 py-1.5 hover:bg-gray-200 text-gray-600 font-medium transition"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1.5 font-semibold text-sm bg-white min-w-[40px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange("inc")}
                                        className="px-3 py-1.5 hover:bg-gray-200 text-gray-600 font-medium transition"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Actions Command Segment */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <button
                                onClick={() => addToCart(false)}
                                disabled={product.stock <= 0 || isAdding}
                                className="w-full py-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base transition duration-200 flex items-center justify-center gap-2 shadow-md disabled:bg-gray-200 cursor-pointer"
                            >
                                <FaShoppingBag /> {isAdding ? "Processing..." : "ADD TO CART"}
                            </button>
                            <button
                                onClick={() => addToCart(true)}
                                disabled={product.stock <= 0}
                                className="w-full py-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base transition duration-200 flex items-center justify-center gap-2 shadow-md disabled:bg-gray-200 cursor-pointer"
                            >
                                <FaBolt /> BUY NOW
                            </button>
                        </div>

                        <hr className="border-gray-100 pt-2" />

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                                <FaTruck className="text-amber-600 text-lg flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-gray-900">Priority Dispatch</p>
                                    <p>Dispatched securely under 24 hours</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                                <FaUndo className="text-amber-600 text-lg flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-gray-900">7-Day Return window</p>
                                    <p>Guaranteed straightforward returns</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                                <FaShieldAlt className="text-amber-600 text-lg flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-gray-900">100% Certified</p>
                                    <p>Direct supply authentication</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}