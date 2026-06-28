"use client";

// src/app/delivery/earnings/page.js
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";

export default function EarningsPage() {
  const [earnings, setEarnings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const data = await fetchFromAPI("/deliveryBoy/earnings");
        setEarnings(data);
      } catch (error) {
        console.error("Failed to fetch earnings:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Your Earnings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Track your payouts, wallet balances, and performance lifetime statistics.
            </p>
          </div>
          <div className="text-xs text-gray-400 self-start sm:self-auto bg-gray-100 px-3 py-1 rounded-full">
            Updated just now
          </div>
        </div>

        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1: Wallet Balance (Flipkart Inspired Blue/Feature Highlight) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Balance
                </p>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                  ₹{isLoading ? "---" : (earnings.walletBalance?.toLocaleString("en-IN") || 0)}
                </span>
              </div>
            </div>
            <div className="bg-blue-50/50 px-5 sm:px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <button className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Withdraw to Bank →
              </button>
            </div>
          </div>

          {/* Card 2: Total Earnings (Classic Bold Neutral Slate) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Total Earnings
                </p>
                <div className="p-1.5 bg-gray-100 rounded-lg text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                  ₹{isLoading ? "---" : (earnings.totalEarnings?.toLocaleString("en-IN") || 0)}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 px-5 sm:px-6 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Lifetime accumulated payouts</span>
            </div>
          </div>

          {/* Card 3: Pending Payout (Amazon Inspired Warm Alert Amber) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md sm:col-span-2 lg:col-span-1">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Pending Payout
                </p>
                <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                  ₹{isLoading ? "---" : (earnings.pendingPayout?.toLocaleString("en-IN") || 0)}
                </span>
              </div>
            </div>
            <div className="bg-amber-50/40 px-5 sm:px-6 py-3 border-t border-gray-100">
              <span className="text-xs text-amber-800 font-medium">Next scheduled settlement: Tuesday</span>
            </div>
          </div>

        </div>

        {/* Amazon/Flipkart style mini helper notice banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs sm:text-sm text-blue-800">
            <p className="font-semibold">Need help with balances?</p>
            <p className="mt-0.5 text-blue-700/90">Payout updates take up to 24 hours to sync with your partner banking node. For any disputes, contact agent support.</p>
          </div>
        </div>

      </div>
    </div>
  );
}