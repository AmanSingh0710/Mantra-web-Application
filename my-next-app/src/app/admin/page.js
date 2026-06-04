"use client";
import { useState, useEffect } from "react";
import { fetchFromAPI } from "@/utils/api";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      // 🔴 IMPORTANT CHECK
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const result = await fetchFromAPI("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("API Error:", result);
          return;
        }

        setData(result);

      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return <p>Loading Analytics...</p>;

  return <></>;
}