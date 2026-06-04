"use client";

import { fetchFromAPI } from "@/utils/api";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

export default function Reviews() {
  const sliderRef = useRef(null);
  const [reviews, setReviews] = useState([]);

  const scroll = (dir) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: dir === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await fetchFromAPI("/review/public");

        // ✅ SAFE handling
        if (Array.isArray(data)) {
          setReviews(data);
        } else if (Array.isArray(data?.data)) {
          setReviews(data.data);
        } else {
          console.error("Unexpected API format:", data);
          setReviews([]);
        }

      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="reviews-section">
      <h2 className="reviews-title">REVIEWS</h2>

      <div className="reviews-wrapper">
        {/* LEFT ARROW */}
        <button className="review-btn left" onClick={() => scroll("left")}>
          ‹
        </button>

        {/* SLIDER */}
        <div className="reviews-track" ref={sliderRef}>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((item, i) => (
              <div key={i} className="review-card">
                <Image
                  src={item.customerId?.image || "/review.webp"}
                  alt={item.customerId?.name || "User"}
                  fill
                  sizes="
                  (max-width: 480px) 100vw,
                  (max-width: 768px) 50vw,
                  (max-width: 1024px) 33vw,
                  20vw
                "
                  className="review-img"
                />

                <div className="review-overlay">
                  <div className="stars">
                    {"★".repeat(item.rating || 0)}
                  </div>

                  <h4>- {item.customerId?.name || "Anonymous"}</h4>

                  <p>{item.comment || "No comment"}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center w-full py-10 text-gray-400">
              No reviews available
            </p>
          )}
        </div>

        {/* RIGHT ARROW */}
        <button className="review-btn right" onClick={() => scroll("right")}>
          ›
        </button>
      </div>
    </section>
  );
}