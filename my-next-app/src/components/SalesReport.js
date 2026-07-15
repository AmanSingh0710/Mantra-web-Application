"use client";

import { fetchFromAPI } from "@/utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, Package, IndianRupee, ShoppingBag, ArrowUpRight } from "lucide-react";



export default function SalesReport() {
  const [data, setData] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const loadSalesReport = async () => {
      try {
        const result = await fetchFromAPI("/salesreport/sales-report");
        setData(result);
      } catch (err) {
        console.error("Sales report error:", err);
      }
    };

    loadSalesReport();
  }, []);

  if (!data) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-semibold tracking-wide">Analysing Sales Data...</p>
      </div>
    </div>
  );

  const handleExportExcel = () => {
    window.open(`${BASE_URL}/salesreport/export-sales`, "_blank");
  };

  const handleDownloadPDF = () => {
    window.open(`${BASE_URL}/salesreport/download-report`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12 font-sans text-slate-900">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sales Analytics</h1>
          <p className="text-slate-500 mt-1 font-medium">Real-time performance overview of your storefront.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleDownloadPDF} className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            Download Report
          </button>
          <button onClick={handleExportExcel} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards - Amazon Style Performance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Orders"
          value={data.totalOrders}
          icon={<ShoppingBag className="text-blue-600" size={20} />}
          color="bg-blue-50"
          trend="+12.5%"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${data.totalRevenue.toLocaleString()}`}
          icon={<IndianRupee className="text-emerald-600" size={20} />}
          color="bg-emerald-50"
          trend="+8.2%"
        />
        <StatCard
          title="Products Sold"
          value={data.totalProductsSold}
          icon={<Package className="text-orange-600" size={20} />}
          color="bg-orange-50"
          trend="+5.4%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Revenue Chart - Professional Area Chart */}
        <div className="lg:col-span-2 bg-white shadow-sm border border-slate-200 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Monthly Revenue Growth
            </h2>
            <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-md p-2 outline-none">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlySales}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="_id.month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Top Selling Products</h2>
            <p className="text-xs text-slate-500 font-medium">Ranked by units sold</p>
          </div>

          <div className="divide-y divide-slate-100 h-[380px] overflow-y-auto custom-scrollbar">
            {data.topProducts.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Product ID</p>
                    <p className="text-xs text-slate-400 font-mono tracking-tighter">{item._id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{item.totalSold}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Units</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white text-center border-t border-slate-100">
            <Link href="/admin/products">
              <button className="text-blue-600 text-xs font-bold hover:underline">View All Inventory
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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