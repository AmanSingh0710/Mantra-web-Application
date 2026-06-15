"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaTruck, FaLock, FaUserMd } from "react-icons/fa";
import { fetchFromAPI, getImageUrl } from "@/utils/api";

export default function Hero() {
  const [heroes, setHeroes] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const res = await fetchFromAPI("/hero");
        if (res?.success) setHeroes(res.heroes || []);
      } catch (error) {
        console.log("Hero Fetch Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroes();
  }, []);

  useEffect(() => {
    if (heroes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroes]);

  return (
    <section className="w-full overflow-hidden bg-white">
      {/* --- HERO SLIDER (Pure Image Slider) --- */}
      <div className="relative w-full h-[300px] sm:h-[450px] md:h-[550px] lg:h-[75vh] min-h-[250px] max-h-[850px]">
        {loading && <div className="w-full h-full animate-pulse bg-gray-200" />}

        {!loading &&
          heroes.map((hero, index) => (
            <div
              key={hero._id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
            >
              <img
                src={hero.image?.url}
                alt="Hero Image"
                className="w-full h-full object-cover"
              />
              {/* Optional: Remove this overlay div if you want the images to be bright/original */}
              <div className="absolute inset-0 bg-black/10 z-10" />
            </div>
          ))}
      </div>

      {/* --- INFO BAR --- */}
      <div className="bg-[#fbf7f0] border-t border-[#e6dccb]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xs:grid-cols-3 divide-y xs:divide-y-0 xs:divide-x divide-[#e6dccb]">
          <InfoItem Icon={FaTruck} label="Free Shipping" />
          <InfoItem Icon={FaLock} label="Secure Checkout" />
          <InfoItem Icon={FaUserMd} label="Doctor Consultation" />
        </div>
      </div>
    </section>
  );
}

function InfoItem({ Icon, label }) {
  return (
    <div className="flex flex-row xs:flex-col items-center justify-center gap-3 py-6 px-4">
      <Icon className="text-[#9c7c3b] text-xl md:text-2xl" />
      <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#3a2a16]">
        {label}
      </span>
    </div>
  );
}