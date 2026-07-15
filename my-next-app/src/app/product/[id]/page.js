"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchFromAPI, getImageUrl } from "@/utils/api";
import { FaShoppingBag, FaBolt, FaStar, FaShieldAlt, FaTruck, FaUndo, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

//src/app/product/[id]/page.js


export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetchFromAPI(`/Adminproducts/public/${id}`);
                if (res?.product) {
                    setProduct(res.product);
                    setReviews(res.reviews || []);
                    setSelectedImage(res.product.thumbnail.url);
                }
                else if (res?.data?.product) {
                    setProduct(res.data.product);
                    setSelectedImage(res.data.product.thumbnail.url);
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


    const addToCart = async (redirectToCheckout = false) => {
        setIsAdding(true);

        try {
            await fetchFromAPI("/cart/add", {
                method: "POST",
                body: JSON.stringify({
                    productId: product._id,
                    quantity,
                }),
            });

            if (redirectToCheckout) {
                toast.success("Redirecting to checkout...");
                router.push("/cart?checkout=true");
            } else {
                toast.success("Added to cart successfully");
                router.push("/cart");
            }

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to add product");
        } finally {
            setIsAdding(false);
        }
    };

    const actualPrice =
        product.discountPrice > 0
            ? product.discountPrice
            : product.price;

    const discountPercentage =
        product.discountPrice > 0
            ? Math.round(
                ((product.price - product.discountPrice) /
                    product.price) *
                100
            )
            : 0;


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
                                src={getImageUrl(selectedImage || product.thumbnail?.url)}
                                alt={product.productName}
                                className="object-contain max-h-[450px] w-full mix-blend-multiply hover:scale-105 transition duration-300"
                            />
                        </div>

                        {/* Interactive Secondary Thumbnail Gallery Lineup */}
                        {product.images && product.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                <button
                                    onClick={() => setSelectedImage(product.thumbnail?.url)}
                                    className={`w-20 h-20 border-2 rounded-md p-1 bg-white flex-shrink-0 ${selectedImage === product.thumbnail?.url ? 'border-amber-500' : 'border-gray-200'}`}
                                >
                                    <img src={getImageUrl(product.thumbnail?.url)} className="w-full h-full object-contain mix-blend-multiply" alt="primary thumb" />
                                </button>
                                {product.images?.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img.url)}
                                        className={`w-20 h-20 border-2 rounded-md p-1 bg-white flex-shrink-0 ${selectedImage === img.url
                                            ? "border-amber-500"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        <img
                                            src={getImageUrl(img.url)}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                            alt={`gallery-${idx}`}
                                        />
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
                                        router.push(`/product?category=${product.category?._id}`);
                                    }
                                }}
                                className="text-xs uppercase tracking-wider text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded cursor-pointer hover:bg-amber-100 hover:text-amber-700 transition-all inline-block"
                            >
                                {product.category?.name || "Premium Segment"}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-semibold mt-3 tracking-tight text-gray-900 uppercase">
                                {product.productName}
                            </h1>
                        </div>

                        {/* Ratings & Metrics Dashboard Line */}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <div className="bg-green-600 text-white flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                                {product.averageRating ? Number(product.averageRating).toFixed(1) : "0.0"} <FaStar className="text-[10px]" />
                            </div>

                            <div className="flex items-center space-x-0.5">
                                {renderStars(product.averageRating)}
                            </div>

                            {(product.totalReviews > 0) ? (
                                <span className="text-gray-500 font-medium hover:underline cursor-pointer">
                                    {Number(product.averageRating || 0).toLocaleString()} Ratings &{' '}
                                    {Number(product.totalReviews || 0).toLocaleString()} Reviews
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
                                <span className="text-3xl font-bold text-gray-900">₹{actualPrice}</span>

                                {product.discountPrice > 0 && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
                                        <span className="text-green-600 font-semibold text-lg">{discountPercentage}% off</span>
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

                        {/* Product Description Section */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

                            {/* Header */}
                            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Product Description
                                </h2>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                {product.description ? (
                                    <div
                                        className="prose prose-sm md:prose-base max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-img:rounded-lg"
                                        dangerouslySetInnerHTML={{
                                            __html: product.description,
                                        }}
                                    />
                                ) : (
                                    <p className="text-gray-500">
                                        No product description available.
                                    </p>
                                )}
                                <div className="bg-white border border-gray-200 rounded-xl mt-6">
                                    <div className="px-5 py-4 border-b bg-gray-50">
                                        <h2 className="text-lg font-semibold">
                                            About this item
                                        </h2>
                                    </div>

                                    <div className="p-5">
                                        <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                                            <li>Premium quality ingredients</li>
                                            <li>Suitable for all skin types</li>
                                            <li>Dermatologically tested</li>
                                            <li>Easy daily usage</li>
                                            <li>Made in India</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Reviews */}
                        <div className="mt-8 bg-white border rounded-xl p-5">
                            <h2 className="text-xl font-semibold mb-4">
                                Customer Reviews ({reviews.length})
                            </h2>

                            {reviews.length === 0 ? (
                                <p className="text-gray-500">
                                    No reviews yet
                                </p>
                            ) : (
                                reviews.map((review) => (
                                    <div
                                        key={review._id}
                                        className="border-b py-4"
                                    >
                                        <h4 className="font-semibold">
                                            {review.customerId?.name || "Anonymous"}
                                        </h4>

                                        <div className="flex">
                                            {renderStars(review.rating)}
                                        </div>

                                        <p className="mt-2 text-gray-600">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))
                            )}
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