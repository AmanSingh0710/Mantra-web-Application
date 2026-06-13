"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchFromAPI } from "@/utils/api";
import { FaStar, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";



export default function TopPicks() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("BESTSELLER");
  const [loading, setLoading] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const scrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await fetchFromAPI("/Adminproducts/public");

      setProducts(data?.products || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleAdd = async (product) => {
    try {
      await fetchFromAPI("/cart/add", {
        method: "POST",
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      toast.success("Added to cart!");
      router.push("/cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReviewSubmit = async () => {
    if (!userComment.trim()) {
      return toast.error("Please add a comment");
    }

    try {
      setSubmitting(true);

      await fetchFromAPI("/review/add", {
        method: "POST",
        body: JSON.stringify({
          productId: selectedProduct._id,
          rating: userRating,
          comment: userComment.trim(),
        }),
      });

      toast.success("Review submitted successfully!");

      setShowReviewModal(false);
      setUserComment("");
      setUserRating(5);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((p) => p.listingType === activeTab && !p.isDeleted)
    : [];

  if (loading)
    return (
      <div className="text-center py-20 text-gray-400 font-bold animate-pulse">
        LOADING...
      </div>
    );

  return (
    <section className="w-full bg-white py-10 md:py-20 overflow-x-hidden relative">
      {/* Header */}
      <div className="text-center px-4 mb-10">
        <h2 className="text-xl md:text-3xl font-black tracking-[0.3em] text-gray-900 uppercase">
          Top Picks This Season
        </h2>
        <div className="h-1 w-16 bg-[#d4c3a3] mx-auto mt-3"></div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10 px-4">
        <div className="inline-flex bg-[#f3eee5] p-1.5 rounded-full overflow-x-auto no-scrollbar">
          {["BESTSELLER", "NEW_ARRIVAL", "COMBOS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 md:px-10 py-2.5 rounded-full transition-all text-[9px] md:text-[11px] font-black tracking-widest cursor-pointer ${activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-black"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative px-4 sm:px-10 lg:px-20">
        <button onClick={() => scroll("left")} className="absolute left-2 lg:left-8 top-[35%] z-20 bg-white border shadow-md rounded-full p-3 hidden sm:flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer"><FaChevronLeft size={12} /></button>
        <button onClick={() => scroll("right")} className="absolute right-2 lg:right-8 top-[35%] z-20 bg-white border shadow-md rounded-full p-3 hidden sm:flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer"><FaChevronRight size={12} /></button>

        <div ref={scrollRef} className="flex overflow-x-auto gap-4 md:gap-6 lg:gap-8 scroll-smooth no-scrollbar pb-10" style={{ scrollSnapType: "x mandatory" }}>
          {filteredProducts.map((product) => (
            <div key={product._id} className="flex-shrink-0 w-[78%] sm:w-[45%] md:w-[30%] lg:w-[22%] flex flex-col group" style={{ scrollSnapAlign: "start" }}>
              <div className="bg-[#f9f9f9] aspect-square flex items-center justify-center overflow-hidden mb-4 relative rounded-sm border border-gray-50 shadow-sm">
                <img src= {product.thumbnail?.url} alt={product.productName} className="w-full h-32 sm:h-44 md:h-52 lg:h-56 object-contain transition-transform duration-700 group-hover:scale-110 p-4" />
              </div>

              <div className="text-left space-y-1">
                <h3 className="text-[10px] md:text-xs font-bold text-gray-800 uppercase line-clamp-2 h-8 md:h-10 leading-tight">{product.productName}</h3>
                <p className="text-xs md:text-sm lg:text-base font-black text-gray-900">₹ {product.price || product.price}</p>

                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => <FaStar key={i} size={10} className={i < (product.averageRating || 0) ? "fill-current" : "text-gray-200"} />)}
                  <span className="text-[9px] text-gray-400">{product.averageRating ? Number(product.averageRating).toFixed(1) : "0.0"} ({product.totalReviews || 0}) </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleAdd(product)} className="flex-1 border-2 border-gray-900 py-2.5 text-[9px] font-black bg-white text-gray-900 hover:bg-black hover:text-white transition-all uppercase cursor-pointer">
                    ADD TO CART
                  </button>
                  <button onClick={() => { setSelectedProduct(product); setShowReviewModal(true); }} className="px-3 border-2 border-gray-900 py-2.5 text-[9px] font-black bg-white text-gray-900 hover:bg-black hover:text-white transition-all uppercase cursor-pointer">
                    RATE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- REVIEW MODAL --- */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-black">
          <div className="bg-white w-full max-w-md rounded-lg p-6 relative shadow-2xl">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><FaTimes /></button>
            <h3 className="text-lg font-black uppercase mb-1">Write a Review</h3>
            <p className="text-[10px] text-gray-500 uppercase mb-6">{selectedProduct?.productName}</p>

            <div className="flex justify-center gap-2 mb-6 text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} size={30} className={`cursor-pointer transition-all ${star <= userRating ? "fill-current scale-110" : "text-gray-200"}`} onClick={() => setUserRating(star)} />
              ))}
            </div>

            <textarea className="w-full border border-gray-200 rounded-md p-3 text-sm focus:border-black outline-none min-h-[120px]" placeholder="How was your experience with this product?" value={userComment} onChange={(e) => setUserComment(e.target.value)} />

            <button disabled={submitting} onClick={handleReviewSubmit} className={`w-full bg-black text-white py-4 mt-6 text-xs font-black tracking-widest uppercase rounded shadow-lg transition-all ${submitting ? "opacity-50" : "hover:bg-gray-800 active:scale-95"}`}>
              {submitting ? "SUBMITTING..." : "POST REVIEW"}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}