"use client";
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import StoreCard from "@/components/store/StoreCard";
import { FaRupeeSign, FaShoppingBag, FaUsers, FaUndoAlt } from "react-icons/fa";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnalytics = async () => {
      try {
        // Replace with your actual analytics endpoint
        const response = await fetchFromAPI("/vendor-store/my-store/vendor-stats");
        setData(response);
      } catch (error) {
        console.error("Failed to fetch analytics:", error.message);
      } finally {
        setLoading(false);
      }
    };
    getAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business Analytics</h1>
        <p className="text-gray-500 font-medium">Real-time performance overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StoreCard title="Total Sales" value={`₹${data?.totalSales || 0}`} variant="green" icon={<FaRupeeSign />} isLoading={loading} />
        <StoreCard title="Total Orders" value={data?.orderCount || 0} variant="blue" icon={<FaShoppingBag />} isLoading={loading} />
        <StoreCard title="Customers" value={data?.customerCount || 0} variant="orange" icon={<FaUsers />} isLoading={loading} />
        <StoreCard title="Returns" value={data?.returns || 0} variant="red" icon={<FaUndoAlt />} isLoading={loading} />
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
         <h2 className="text-xl font-black mb-4">Sales Report</h2>
         <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 italic">
           Chart data syncs with /api/analytics
         </div>
      </div>
    </div>
  );
}