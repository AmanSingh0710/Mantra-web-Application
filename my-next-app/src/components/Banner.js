"use client";

import { useEffect, useState, useRef } from "react";
import { fetchFromAPI } from "@/utils/api";

// Swiper components aur styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Swiper CSS (Ensure these are imported)
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // ✅ using centralized API
        const data = await fetchFromAPI("/banner/public");

        if (Array.isArray(data)) {
          const sorted = data
            .filter((b) => b.published === true)
            .sort((a, b) =>
              a.bannerType === "Main Banner" ? -1 : 1
            );

          setBanners(sorted);
        }
      } catch (err) {
        console.error("Banner Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading || banners.length === 0) return null;

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 my-6 relative group">
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          loop={banners.length > 1}
          spaceBetween={0}
          slidesPerView={1}
          className="h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px]"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner._id} className="bg-white">
              <a href={banner.link || "#"} className="relative block w-full h-full">
                {/* w-full h-full aur object-cover se image poori jagah cover karegi */}
                <img
                  src={`${BASE_URL}/uploads/${banner.image}`}
                  alt={banner.bannerType}
                  className="w-full h-full object-cover block"
                />

                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-800">
                  {banner.bannerType}
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Slide Next Button - Hover over this to see Footer Banner */}
      <button
        onMouseEnter={() => swiperRef.current?.slideNext()}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 shadow-xl border border-gray-200 text-black font-bold text-[10px] flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex"
      >
        NEXT
      </button>
    </section>
  );
}