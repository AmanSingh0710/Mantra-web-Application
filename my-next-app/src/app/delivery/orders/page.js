"use client";

// src/app/delivery/orders/page.js
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchFromAPI("/deliveryBoy/my-orders");
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Amazon/Flipkart style colored indicator status badge helper
  const getStatusStyles = (status) => {
    const normalStatus = status?.toLowerCase() || "";
    if (["delivered", "completed"].includes(normalStatus)) {
      return "bg-green-50 text-green-700 border-green-200";
    }
    if (["cancelled", "failed"].includes(normalStatus)) {
      return "bg-red-50 text-red-700 border-red-200";
    }
    if (["shipped", "out for delivery", "in_transit"].includes(normalStatus)) {
      return "bg-blue-50 text-blue-700 border-blue-200 animate-pulse";
    }
    // Default/Pending/Processing state
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Page Heading & Counters */}
        <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              My Shipments
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage runsheets, check customer drop locations, and update package delivery statuses.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium self-start sm:self-auto">
            <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md font-semibold">
              Total assigned: {orders.length}
            </span>
          </div>
        </div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white h-36 rounded-xl border border-gray-200 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && orders.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-base font-semibold text-gray-900">No shipments allocated</h3>
            <p className="text-sm text-gray-500 mt-1">Check back later or contact your supervisor to sync your daily manifest.</p>
          </div>
        )}

        {/* Orders Layout List */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:border-gray-300 transition-colors"
              >
                {/* Card Top Utility Bar */}
                <div className="bg-gray-50/70 px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-gray-700 sm:text-sm">
                      ID: #{order.orderNumber || "N/A"}
                    </span>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <span className="hidden sm:inline">
                      Items: {order.items?.length || 1} { (order.items?.length || 1) === 1 ? 'package' : 'packages' }
                    </span>
                  </div>
                  
                  {/* Status Pill Badge */}
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusStyles(order.status)}`}>
                    {order.status || "Assigned"}
                  </span>
                </div>

                {/* Card Main Body */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left Column: Cost and Content Details */}
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xl font-extrabold text-gray-900">
                        ₹{(order.pricing?.grandTotal || 0).toLocaleString("en-IN")}
                      </span>
                      {order.paymentMode && (
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          order.paymentMode.toLowerCase() === 'cod' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {order.paymentMode}
                        </span>
                      )}
                    </div>

                    {/* Delivery Address Block (Crucial for Delivery Agents) */}
                    {order.shippingAddress && (
                      <div className="text-xs sm:text-sm text-gray-600 max-w-xl">
                        <p className="font-semibold text-gray-800">{order.shippingAddress.name || "Customer Drop"}</p>
                        <p className="text-gray-500 truncate mt-0.5">
                          {order.shippingAddress.street || order.shippingAddress.addressLine1 || "Address details not visible"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Mobile-first Action Tray */}
                  <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                    <a
                      href={`tel:${order.shippingAddress?.phone || order.customer?.phone}`}
                      className="flex-1 md:flex-none text-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Call</span>
                    </a>
                    
                    <button 
                      onClick={() => alert(`Opening navigation/details for #${order.orderNumber}`)}
                      className="flex-1 md:flex-none text-center bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-150"
                    >
                      Update Status
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