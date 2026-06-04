"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/categories/public`);
        const data = await res.json();

        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getImageUrl = (imgName) => {
    if (!imgName || imgName.startsWith("/")) return imgName || "/placeholder.png";
    const cleanPath = imgName.replace(/\\/g, "/");
    return cleanPath.startsWith("uploads/")
      ? `${BASE_URL}/${cleanPath}`
      : `${BASE_URL}/uploads/${cleanPath}`;
  };

  const scroll = (dir) => {
    if (sliderRef.current) {
      const containerWidth = sliderRef.current.clientWidth;
      const scrollAmount = dir === "left" ? -containerWidth * 0.7 : containerWidth * 0.7;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 🌟 Handle Click Function
  const handleCategoryClick = (categoryTitle) => {
    // encodeURIComponent isliye use kiya taaki agar category name me space ho (like "Red Roses") toh URL break na ho
    const encodedCategory = encodeURIComponent(categoryTitle);

    // Aapke flow ke hisab se router path choose karein:
    router.push(`/products?category=${encodedCategory}`);
    // AGAR aapka dedicated page alag hai toh aap `/category/${encodedCategory}` bhi kar sakte hain.
  };

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center items-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="w-full bg-white py-8 md:py-14 border-b border-gray-100 select-none overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-2xl font-black text-gray-900 tracking-wide uppercase">
            Shop By Category
          </h2>
          <div className="h-1 w-12 bg-gray-900 mt-1.5 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto relative px-4 sm:px-8 lg:px-16 group">

        <button
          onClick={() => scroll("left")}
          className="absolute left-2 lg:left-10 top-1/2 -translate-y-1/2 z-30 bg-white border border-gray-200 shadow-md rounded-full p-3 hidden sm:flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Scroll Left"
        >
          <FaChevronLeft size={14} />
        </button>

        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 md:gap-6 scroll-smooth no-scrollbar pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {categories.map((item, i) => (
            <div
              key={i}
              onClick={() => handleCategoryClick(item.name)}
              className="flex-shrink-0 w-[40%] sm:w-[28%] md:w-[22%] lg:w-[15%] flex flex-col items-center group/card cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gray-50 rounded-full border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden mb-3 relative transition-transform duration-300 group-hover/card:scale-105 group-hover/card:shadow-md">
                <Image
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover p-1 rounded-full"
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
                />
              </div>

              <span className="text-xs sm:text-sm font-bold text-gray-800 tracking-tight text-center uppercase group-hover/card:text-black group-hover/card:underline underline-offset-4 transition-colors line-clamp-1 max-w-full px-1">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-2 lg:right-10 top-1/2 -translate-y-1/2 z-30 bg-white border border-gray-200 shadow-md rounded-full p-3 hidden sm:flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          aria-label="Scroll Right"
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