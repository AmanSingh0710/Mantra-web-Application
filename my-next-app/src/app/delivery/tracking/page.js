"use client";

// src/app/delivery/tracking/page.js
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import { 
  MapPinned, 
  Navigation, 
  User, 
  Phone, 
  Package, 
  Clock3, 
  CheckCircle2, 
  Map, 
  AlertCircle 
} from "lucide-react";

export default function TrackingPage() {
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracking();
  }, []);

  const loadTracking = async () => {
    try {
      const data = await fetchFromAPI("/deliveryBoy/tracking");
      setTracking(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Tracking fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to open real-world maps app for the driver turn-by-turn navigation
  const openNavigation = (address) => {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50/50">
        <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-500 mt-3 tracking-wide">Loading active manifests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Feature Title */}
        <div className="border-b border-gray-200 pb-4 flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-sm">
            <MapPinned size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Live Delivery Route
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Active turn-by-turn assignments and client validation controls.
            </p>
          </div>
        </div>

        {/* Empty State Banner */}
        {tracking.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 sm:p-16 text-center shadow-sm max-w-xl mx-auto mt-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Package size={32} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">All caught up!</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              You don&apos;t have any live deliveries assigned right now. Head over to your shipments panel to claim new orders.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {tracking.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:border-gray-300 transition-all"
              >
                {/* Header Sub-bar */}
                <div className="bg-gray-50/80 border-b border-gray-100 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="font-mono bg-gray-200/80 px-2 py-0.5 rounded text-gray-700 font-bold">
                      TASK #{item._id?.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1">
                      <Clock3 size={13} className="text-gray-400" /> Priority Delivery
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    {item.status || "In Transit"}
                  </span>
                </div>

                {/* Main Two-Column Structure Split */}
                <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  
                  {/* Left Column: Customer & Package Info (7/12 cols) */}
                  <div className="p-4 sm:p-6 md:col-span-7 space-y-5">
                    
                    {/* Customer Identity Row */}
                    <div className="flex items-start gap-3.5">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <User size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Consignee Recipient</p>
                        <h3 className="text-base font-bold text-gray-900">{item.customerName || "Verified Customer"}</h3>
                      </div>
                    </div>

                    {/* Address Block */}
                    <div className="flex items-start gap-3.5">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                        <Navigation size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Drop Location Address</p>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                          {item.address || "No address detail found"}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Operational CTA Buttons */}
                    <div className="pt-3 flex flex-wrap gap-2.5">
                      <a
                        href={`tel:${item.customerPhone}`}
                        className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                      >
                        <Phone size={16} />
                        <span>Call Customer</span>
                      </a>

                      <button
                        onClick={() => openNavigation(item.address)}
                        className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 text-center bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
                      >
                        <Map size={16} />
                        <span>Open Maps</span>
                      </button>
                    </div>

                  </div>

                  {/* Right Column: Amazon-style Route Progress Milestone Tracker (5/12 cols) */}
                  <div className="p-4 sm:p-6 md:col-span-5 bg-gray-50/30 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Milestone Checklist</p>
                      
                      {/* Live Timeline Nodes */}
                      <div className="relative pl-5 space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                        <div className="relative flex items-center gap-2.5 text-xs text-gray-500">
                          <span className="absolute -left-[21px] w-3 h-3 rounded-full bg-green-500 border-2 border-white ring-4 ring-green-100"></span>
                          <span className="font-medium line-through">Package Dispatched from Hub</span>
                        </div>
                        <div className="relative flex items-center gap-2.5 text-xs text-gray-900">
                          <span className="absolute -left-[21px] w-3 h-3 rounded-full bg-blue-500 border-2 border-white ring-4 ring-blue-100 animate-pulse"></span>
                          <span className="font-bold">Out for Delivery (Current Step)</span>
                        </div>
                        <div className="relative flex items-center gap-2.5 text-xs text-gray-400">
                          <span className="absolute -left-[21px] w-3 h-3 rounded-full bg-gray-200 border-2 border-white"></span>
                          <span>OTP Handshake / Delivery Completed</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status Trigger */}
                    <button
                      onClick={() => alert(`Prompting status closure update modal for order ID: ${item._id}`)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-lg shadow-sm transition-colors mt-2"
                    >
                      <CheckCircle2 size={16} />
                      <span>Complete Drop Action</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}