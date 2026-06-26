"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { fetchFromAPI } from "@/utils/api";
import toast from "react-hot-toast";
// src/components/ShopBy.js
export default function ShopByConcern() {
  const sliderRef = useRef(null);
  const router = useRouter();
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveConcerns = async () => {
      try {
        const result = await fetchFromAPI("/concerns/public/all");
        if (result.success) {
          setConcerns(result.concerns || []);
        }
      } catch (err) {
        console.error("Frontend concerns hydration failed:", err);
        toast.error("Failed to fetch fresh live category markers");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveConcerns();
  }, []);

  const scroll = (dir) => {
    if (sliderRef.current) {
      const containerWidth = sliderRef.current.clientWidth;
      const scrollAmount = dir === "left" ? -containerWidth * 0.6 : containerWidth * 0.6;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="w-full py-16 flex justify-center items-center bg-white">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (concerns.length === 0) return null;

  return (
    <section className="w-full bg-white py-10 md:py-16 border-b border-gray-100 overflow-hidden relative text-black">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase block mb-1">Targeted Solutions</span>
          <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">
            Shop By Concern
          </h2>
          <div className="h-1 w-16 bg-amber-500 mt-2 rounded-full"></div>
        </div>
      </div>

      {/* CAROUSEL CONTROLS CONTAINER */}
      <div className="max-w-[1440px] mx-auto relative px-4 sm:px-8 lg:px-16 group select-none">

        {/* LEFT TOGGLE ARROW */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 lg:left-10 top-1/2 -translate-y-1/2 z-30 bg-white border border-gray-200 shadow-lg rounded-full p-3 hidden sm:flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <FaChevronLeft size={14} />
        </button>

        {/* HORIZONTAL SNAP CAROUSEL TRACK */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 md:gap-6 scroll-smooth no-scrollbar pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {concerns.map((item, i) => (
            <div
              key={i}
              onClick={() =>router.push(`/concern/${item._id}`)}
              className="flex-shrink-0 w-[40%] sm:w-[28%] md:w-[22%] lg:w-[15%] xl:w-[12.5%] flex flex-col items-center group/card cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Premium Square Mask Wrapper with Aspect Ratio Control */}
              <div className="w-full aspect-square bg-gray-50 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden mb-3 relative transition-all duration-300 group-hover/card:scale-105 group-hover/card:shadow-md group-hover/card:border-amber-500">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Concern Casing Text Field */}
              <span className="text-[11px] sm:text-xs font-extrabold text-gray-700 tracking-tight text-center uppercase group-hover/card:text-amber-600 transition-colors line-clamp-2 max-w-full px-1">
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* RIGHT TOGGLE ARROW */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 lg:right-10 top-1/2 -translate-y-1/2 z-30 bg-white border border-gray-200 shadow-lg rounded-full p-3 hidden sm:flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <FaChevronRight size={14} />
        </button>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}