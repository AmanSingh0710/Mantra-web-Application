"use client";

import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchFromAPI("/dashboard");

        if (!isMounted) return;

        setDashboard(data);
      } catch (err) {
        if (!isMounted) return;

        console.error("Dashboard Error:", err);
        setError(err.message || "Failed to load dashboard.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-5">
          <h2 className="text-lg font-semibold text-red-600">
            Dashboard Error
          </h2>
          <p className="mt-2 text-sm text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Dashboard Components */}
    </>
  );
}