"use client";

// src/app/delivery/page.js
import { useEffect, useState } from "react";
import { fetchFromAPI, getImageUrl } from "@/utils/api";
import { Package, Wallet, CheckCircle2, Clock3, TrendingUp, ArrowUpRight, ChevronRight, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel API calls for hyper-fast execution loading
        const [statsData, profileData] = await Promise.all([
          fetchFromAPI("/deliveryBoy/my-stats"),
          fetchFromAPI("/deliveryBoy/my-profile"),
        ]);
        
        setStats(statsData || {});
        setProfile(profileData || {});
      } catch (error) {
        console.error("Dashboard engine failed to sync:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP REVOLVING HERO CARD BANNER */}
        <div className="relative overflow-hidden rounded-xl bg-slate-900 text-white shadow-sm border border-slate-800">
          {/* Subtle structural texture ring accents typical of Amazon Central branding */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="p-5 sm:p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            
            {/* Left: Driver profile badge card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <img
                  src={getImageUrl(profile.image) || "/fallback-avatar.png"}
                  alt="Identity Profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-slate-700 shadow-lg bg-slate-800"
                />
                <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-slate-900" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {isLoading ? "Loading profile..." : profile.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase border border-blue-500/30">
                    <ShieldCheck size={12} /> Verified Runner
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">{profile.email || "Syncing metadata node..."}</p>
                <p className="text-xs text-slate-500">Vehicle Mode: <span className="text-slate-300 font-semibold uppercase">{profile.vehicleType || "N/A"}</span></p>
              </div>
            </div>

            {/* Right: Quick glance Flipkart-style Wallet Balance card integration */}
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-4 sm:p-5 min-w-full sm:min-w-[280px] flex items-center justify-between lg:justify-start lg:gap-12 group transition-all">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Wallet size={13} className="text-amber-500" /> Wallet Balance
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                  ₹{isLoading ? "---" : (stats.walletBalance || 0).toLocaleString("en-IN")}
                </h2>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center text-xs bg-green-500/10 text-green-400 font-bold px-2 py-1 rounded">
                  <TrendingUp size={12} className="mr-1" /> +12%
                </span>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">Auto-settles Tue</p>
              </div>
            </div>

          </div>
        </div>

        {/* ENTERPRISE METRIC GRID HUB SYSTEM */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Performance Summary (Live Update)</h3>
            <span className="text-[11px] text-gray-400 bg-gray-200/60 px-2 py-0.5 rounded font-mono">24h node cache</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Allocated Shipments */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Runsheets</p>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                    {isLoading ? "---" : (stats.totalDeliveries || 0)}
                  </h4>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
                  <Package size={20} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                <span className="text-green-600 font-semibold flex items-center gap-0.5">+18% lifetime</span>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            </div>

            {/* Card 2: Queued Orders Pending Drop */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Tasks</p>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
                    {isLoading ? "---" : (stats.pendingOrders || 0)}
                  </h4>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600 border border-amber-100">
                  <Clock3 size={20} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                <span className="text-amber-700 font-medium">Requires attention</span>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            </div>

            {/* Card 3: Cleared drop-offs */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Success Drops</p>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-green-600 mt-1">
                    {isLoading ? "---" : (stats.completedOrders || 0)}
                  </h4>
                </div>
                <div className="p-2.5 bg-green-50 rounded-lg text-green-600 border border-green-100">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                <span className="text-green-600 font-semibold flex items-center gap-0.5">
                  98.4% SLA score
                </span>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            </div>

            {/* Card 4: Consolidated Net Gross Earnings */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Revenue</p>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                    ₹{isLoading ? "---" : (stats.totalEarnings || 0).toLocaleString("en-IN")}
                  </h4>
                </div>
                <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600 border border-blue-100">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                  +31% vs last wk <ArrowUpRight size={12} />
                </span>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            </div>

          </div>
        </div>

        {/* LOGISTICS NOTICE FOOTER BLOCK */}
        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl flex gap-3 text-xs text-amber-800">
          <div className="shrink-0 text-amber-600 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <span className="font-bold">Amazon/Flipkart Center Directive:</span> Real-time payouts reflect upon successful OTP confirmation triggers at delivery gates. Always verify cash or online checkouts before finishing run updates.
          </div>
        </div>

      </div>
    </div>
  );
}