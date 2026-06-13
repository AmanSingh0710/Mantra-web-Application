"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaStar, FaSlidersH, FaTimes, FaShoppingBag } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
//src/app/product/page.js
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500 font-bold animate-pulse tracking-wider">
          LOADING STOREFRONT...
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/Adminproducts/public`);
        const data = await res.json();

        if (data.products) {
          const cats = Array.from(new Set(data.products.map(p => p.category))).filter(Boolean);
          setAllCategories(cats);

          if (selectedCategory) {
            const filtered = data.products.filter(
              (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
            );
            setProducts(filtered);
          } else {
            setProducts(data.products);
          }
        }
      } catch (err) {
        console.error("Error loading products catalog:", err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory]);

  const handleCategoryFilter = (cat) => {
    if (cat === selectedCategory) {
      setSelectedCategory("");
      router.push("/product");
    } else {
      setSelectedCategory(cat);
      router.push(`/product?category=${encodeURIComponent(cat)}`);
    }
  };

  const getImageUrl = (thumbnail) => {
    if (!thumbnail) return "/placeholder.png";
    const cleanPath = thumbnail.replace(/\\/g, "/");
    return cleanPath.startsWith("uploads/")
      ? `${BASE_URL}/${cleanPath}`
      : `${BASE_URL}/uploads/${cleanPath}`;
  };

  const handleAddCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login to add items to cart");

    try {
      const res = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (res.ok) {
        toast.success("Added to cart! 🎉");
        router.push("/cart");
      } else {
        toast.error("Failed to update cart bucket.");
      }
    } catch (err) {
      toast.error("Error adding to cart");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f1f3f6] py-4 text-black antialiased">
      <Toaster position="top-center" />
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-8">

        {/* Amazon/Flipkart Top Banner Header */}
        <div className="bg-white p-4 rounded-sm border border-gray-200 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div>
            <h1 className="text-base md:text-lg font-bold text-gray-900 uppercase tracking-tight">
              {selectedCategory ? `${selectedCategory} Collection` : "All Products"}
            </h1>
            <p className="text-xs text-gray-500">Showing {products.length} products</p>
          </div>

          {selectedCategory && (
            <button
              onClick={() => handleCategoryFilter("")}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-700 text-xs font-semibold rounded-sm transition-all"
            >
              Clear Filter <FaTimes size={10} />
            </button>
          )}
        </div>

        {/* Workspace Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* 1. SIDEBAR FILTER: Desktop me sticky side block, Mobile me Horizontal Top Pill Slider */}
          <div className="lg:col-span-3 bg-white p-4 rounded-sm border border-gray-200 shadow-sm h-fit lg:sticky lg:top-20">
            <div className="hidden lg:flex items-center gap-2 border-b border-gray-100 pb-2 mb-3">
              <FaSlidersH className="text-gray-600" size={12} />
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Filters</h2>
            </div>

            <div>
              <h3 className="hidden lg:block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</h3>

              {/* Mobile Adaptive Scroll Track */}
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-1 max-h-[350px]">
                {allCategories.map((cat, idx) => {
                  const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={idx}
                      onClick={() => handleCategoryFilter(cat)}
                      className={`flex-shrink-0 text-left px-4 lg:px-3 py-1.5 lg:py-2.5 text-xs rounded-sm transition-all uppercase font-semibold flex items-center justify-between border lg:border-none cursor-pointer ${isActive
                          ? "bg-orange-500 text-white border-orange-500 shadow-sm lg:bg-[#2874f0]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                    >
                      <span>{cat}</span>
                      {isActive && <span className="hidden lg:block w-1.5 h-1.5 bg-white rounded-full"></span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. DYNAMIC GRID INTERFACE */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="w-full py-32 bg-white rounded-sm border border-gray-200 flex justify-center items-center">
                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white text-center py-20 rounded-sm border border-gray-200 shadow-sm">
                <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">No Active Products</p>
                <p className="text-[11px] text-gray-500">No items listed under this configuration right now.</p>
              </div>
            ) : (
              /* Flipkart/Amazon Balanced Standard Product Row Grid mapping logic */
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border border-gray-100 rounded-sm p-2 sm:p-3 flex flex-col group transition-all hover:shadow-md cursor-pointer relative"
                    onClick={() => router.push(`/product/${product._id}`)}
                  >

                    {/* Item Image Box Container Layout */}
                    <div className="bg-white aspect-square flex items-center justify-center overflow-hidden mb-2 relative p-2">
                      <img
                        src={getImageUrl(product.thumbnail)}
                        alt={product.productName}
                        className="w-full h-32 sm:h-40 object-contain transition-transform duration-300 group-hover:scale-102"
                        loading="lazy"
                      />
                    </div>

                    {/* Metadata Specs Fields */}
                    <div className="flex flex-col flex-1 text-left pt-1">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{product.category}</span>
                      <h3 className="text-xs text-gray-800 font-medium line-clamp-2 h-8 leading-tight mb-1 group-hover:text-blue-600">
                        {product.productName}
                      </h3>

                      {/* Flipkart Star Box Rating */}
                      <div className="flex items-center gap-1.5 my-1">
                        <div className="bg-green-700 text-white flex items-center gap-0.5 px-1 py-0.5 rounded-sm text-[10px] font-bold">
                          {product.averageRating ? Number(product.averageRating).toFixed(1) : "4.0"} <FaStar size={8} className="fill-current text-white" />
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold">
                          ({product.totalReviews || 0})
                        </span>
                      </div>

                      {/* Price Segment */}
                      <div className="flex items-baseline gap-1.5 mt-1 mb-3">
                        <span className="text-sm font-bold text-gray-900">
                          ₹{product.discountPrice > 0 ? product.discountPrice : product.price}
                        </span>

                        {product.discountPrice > 0 && (
                          <>
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{product.price}
                            </span>

                            <span className="text-[10px] text-green-600 font-semibold">
                              {Math.round(
                                ((product.price - product.discountPrice) / product.price) * 100
                              )}
                              % off
                            </span>
                          </>
                        )}
                      </div>

                      {/* Premium Add To Cart Flipkart Theme Action Trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents layout routing bubbling conflict
                          handleAddCart(product._id);
                        }}
                        className="w-full mt-auto border border-gray-300 sm:border-2 border-orange-500 py-1.5 text-[10px] font-bold bg-white text-orange-600 hover:bg-orange-500 hover:text-white transition-all rounded-sm flex items-center justify-center gap-1"
                      >
                        <FaShoppingBag size={10} /> ADD TO CART
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}