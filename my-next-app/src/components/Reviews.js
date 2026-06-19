"use client";

import { fetchFromAPI } from "@/utils/api";
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

  // --- Inline CSS Styles (Amazon / Flipkart Theme) ---
  const styles = {
    section: {
      padding: "20px 4%",
      backgroundColor: "#f1f3f6", // Flipkart gray background
      fontFamily: "Arial, sans-serif",
    },
    title: {
      fontSize: "22px",
      fontWeight: "600",
      color: "#212121",
      marginBottom: "16px",
      letterSpacing: "0.5px",
    },
    wrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    track: {
      display: "flex",
      gap: "16px",
      overflowX: "auto",
      scrollBehavior: "smooth",
      width: "100%",
      padding: "8px 4px",
      scrollbarWidth: "none", // Hide default scrollbar Firefox
      WebkitOverflowScrolling: "touch",
    },
    // Standardized card layout similar to e-commerce product reviews
    card: {
      flex: "0 0 280px", // Base size on mobile
      maxWidth: "320px", // Prevents overstretching
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 2px 4px 0 rgba(0,0,0,.08)",
      border: "1px solid #e0e0e0",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    userHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "10px",
    },
    avatar: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      objectFit: "cover",
      backgroundColor: "#f0f0f0",
    },
    username: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#212121",
      margin: 0,
    },
    verified: {
      fontSize: "11px",
      color: "#878787",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "3px",
    },
    stars: {
      color: "#ff9f00", // Flipkart / Amazon Star Gold
      fontSize: "16px",
      margin: "4px 0 8px 0",
    },
    comment: {
      fontSize: "13px",
      color: "#333333",
      lineHeight: "1.5",
      margin: 0,
      display: "-webkit-box",
      WebkitLineClamp: "4", // Hard limit text wrap on compact devices
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    btn: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      border: "1px solid #e0e0e0",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
      width: "40px",
      height: "45px",
      fontSize: "24px",
      cursor: "pointer",
      zIndex: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#333",
      borderRadius: "4px",
    },
  };

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Customer Reviews</h2>

      <div style={styles.wrapper}>
        {/* LEFT ARROW (Hidden implicitly via touch UX on tiny screens, great for desktop) */}
        <button 
          style={{ ...styles.btn, left: "-15px" }} 
          className="nav-btn-desktop" 
          onClick={() => scroll("left")}
        >
          ‹
        </button>

        {/* SLIDER */}
        <div style={styles.track} ref={sliderRef} className="hide-scrollbar">
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((item, i) => (
              <div key={i} style={styles.card}>
                <div>
                  {/* User info head */}
                  <div style={styles.userHeader}>
                    <img
                      src={item.customerId?.image || "/review.webp"}
                      alt={item.customerId?.name || "User"}
                      style={styles.avatar}
                    />
                    <div>
                      <h4 style={styles.username}>
                        {item.customerId?.name || "Anonymous User"}
                      </h4>
                      <p style={styles.verified}>
                        <span style={{ color: "#388e3c" }}>✓</span> Verified Purchaser
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div style={styles.stars}>
                    {"★".repeat(Math.min(5, Math.max(0, item.rating || 0)))}
                    {"☆".repeat(5 - Math.min(5, Math.max(0, item.rating || 0)))}
                  </div>

                  {/* Review Text */}
                  <p style={styles.comment}>{item.comment || "No comment left by the buyer."}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", width: "100%", padding: "40px 0", color: "#878787" }}>
              No reviews available yet
            </p>
          )}
        </div>

        {/* RIGHT ARROW */}
        <button 
          style={{ ...styles.btn, right: "-15px" }} 
          className="nav-btn-desktop" 
          onClick={() => scroll("right")}
        >
          ›
        </button>
      </div>

      {/* Global mini-style tag injected for handling browser specific scrollbar resets safely */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .nav-btn-desktop { display: none !important; }
        }
      `}} />
    </section>
  );
}