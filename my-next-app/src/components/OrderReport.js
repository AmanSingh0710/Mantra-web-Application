"use client";

import { fetchFromAPI } from "@/utils/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingBag,
  IndianRupee,
  ArrowUpRight,
  Package,
  FileText,
  Download,
  Calendar
} from "lucide-react";

export default function OrderReport() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const result = await fetchFromAPI("/report/orders");
        setData(result);
      } catch (err) {
        console.error("Report fetch error:", err);
      }
    };

    loadReport();
  }, []);

  const handleExport = () => {
    window.open(`${BASE_URL}/report/orders/export`, "_blank");
  };

  const handleDownload = () => {
    window.open(`${BASE_URL}/report/orders/download`, "_blank");
  };

  if (!data)
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-semibold tracking-wide">Generating Order Report...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12 font-sans text-slate-900">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order Report</h1>
          <p className="text-slate-500 mt-1 font-medium">Detailed breakdown of customer transactions and fulfillment.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all text-slate-700"
          >
            <FileText size={18} />
            Download PDF
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-all"
          >
            <Download size={18} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Orders"
          value={data.totalOrders}
          icon={<ShoppingBag className="text-blue-600" size={20} />}
          color="bg-blue-50"
          trend="+5.2%"
        />
        <StatCard
          title="Revenue Collected"
          value={`₹${data.totalRevenue.toLocaleString()}`}
          icon={<IndianRupee className="text-emerald-600" size={20} />}
          color="bg-emerald-50"
          trend="+12.8%"
        />
        <StatCard
          title="Fulfillment Rate"
          value="98.4%"
          icon={<Package className="text-orange-600" size={20} />}
          color="bg-orange-50"
          trend="+1.2%"
        />
      </div>

      {/* Main Content: Chart & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Order Volume Chart */}
        <div className="lg:col-span-2 bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" />
              Order Volume Trends
            </h2>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.orders?.slice(0, 7).reverse()}> {/* Assuming orders have dates */}
                <defs>
                  <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="createdAt"
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="totalAmount" stroke="#3b82f6" strokeWidth={3} fill="url(#colorOrder)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Summary List */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
            <p className="text-xs text-slate-500 font-medium">Last {data.orders.length} orders processed</p>
          </div>

          <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
            {data.orders.map((order) => (
              <div key={order._id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-slate-800">#{order._id.slice(-6).toUpperCase()}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-400 font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-black text-slate-900">₹{order.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white text-center border-t border-slate-100">
            <button className="text-blue-600 text-xs font-bold hover:underline">Download Full History</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable StatCard Component (Matching your SalesReport)
function StatCard({ title, value, icon, color, trend }) {
  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-300 transition-all cursor-default">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${color} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
          <ArrowUpRight size={14} />
          <span className="text-xs font-bold">{trend}</span>
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
        <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{value}</p>
      </div>
    </div>
  );
}