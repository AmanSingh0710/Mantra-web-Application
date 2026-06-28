"use client";

// src/app/delivery/completed-orders/page.js
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import { CheckCircle2, ArrowLeftRight, Package, Calendar, Search } from "lucide-react";

export default function CompletedOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        // Dynamic endpoint pulling from your live delivery backend module
        const data = await fetchFromAPI("/deliveryBoy/completed-orders");
        const formattedData = Array.isArray(data) ? data : [];
        setOrders(formattedData);
        setFilteredOrders(formattedData);
      } catch (error) {
        console.error("Failed to load historical manifest:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedOrders();
  }, []);

  // Amazon/Flipkart style search indexing to lookup historical items instantly
  useEffect(() => {
    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = orders.filter((order) => {
      const orderId = order.orderNumber || order._id || "";
      const customerName = order.shippingAddress?.name || order.customerName || "";
      return (
        orderId.toLowerCase().includes(lowercaseQuery) ||
        customerName.toLowerCase().includes(lowercaseQuery)
      );
    });
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Block & Quantitative Stat Counters */}
        <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Delivery History
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Review completed runsheets, returns, and total closed performance drop-offs.
            </p>
          </div>
          <div className="text-xs sm:text-sm font-semibold bg-gray-100 border border-gray-200 text-gray-800 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            Total Manifest: {orders.length} orders
          </div>
        </div>

        {/* Amazon-Style Search & Filter Input Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm flex items-center gap-2">
          <Search size={18} className="text-gray-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm outline-none text-gray-900 placeholder-gray-400 bg-transparent font-medium"
          />
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-white border border-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State Banner */}
        {!isLoading && filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm max-w-md mx-auto">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No completed orders found</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {searchQuery ? "Try refining your search terms." : "Your closed manifest history is currently empty."}
            </p>
          </div>
        )}

        {/* Fully Responsive Manifest Engine */}
        {!isLoading && filteredOrders.length > 0 && (
          <>
            {/* MOBILE ONLY SCREEN CARD LAYOUT (Hidden on Medium/Tablet Viewports upwards) */}
            <div className="space-y-3 md:hidden">
              {filteredOrders.map((order) => {
                const isDelivered = ["delivered", "completed"].includes(order.status?.toLowerCase());
                return (
                  <div 
                    key={order._id || order.id} 
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="font-mono font-bold text-sm text-gray-900">
                        #{order.orderNumber || order.id || order._id?.slice(-6)}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                        isDelivered ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                      }`}>
                        {isDelivered ? <CheckCircle2 size={12} /> : <ArrowLeftRight size={12} />}
                        {order.status || "Delivered"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                      <div>
                        <p className="text-gray-400 font-medium">Customer</p>
                        <p className="font-semibold text-gray-800 mt-0.5">
                          {order.shippingAddress?.name || order.customer || "Partner Guest"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 font-medium">Settled Payout</p>
                        <p className="font-extrabold text-gray-900 mt-0.5">
                          ₹{(order.pricing?.grandTotal || order.amount || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP/TABLET TABLE LAYOUT (Hidden on small phone screens) */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-mono">Order ID</th>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4 text-center">Closure Status</th>
                    <th className="py-3.5 px-4 text-right">Settled Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredOrders.map((order) => {
                    const isDelivered = ["delivered", "completed"].includes(order.status?.toLowerCase());
                    return (
                      <tr key={order._id || order.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-gray-900">
                          #{order.orderNumber || order.id || order._id?.slice(-8).toUpperCase()}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-gray-800">
                            {order.shippingAddress?.name || order.customer || "Partner Guest"}
                          </p>
                          <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Calendar size={11} /> Closed via Runner Node
                          </p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                            isDelivered ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            {isDelivered ? <CheckCircle2 size={13} /> : <ArrowLeftRight size={13} />}
                            {order.status || "Delivered"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-extrabold text-gray-900 text-base">
                          ₹{(order.pricing?.grandTotal || order.amount || 0).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
}