"use client";

import { fetchFromAPI } from "@/utils/api";
import { getImageUrl } from "@/utils/api";
import { useState, useMemo, useEffect } from "react";
import {
  FaChevronDown, FaRegClock, FaCheckCircle, FaBoxOpen, FaTruck, FaTimesCircle, FaUndo, FaExclamationCircle, FaChartLine, FaStore, FaUsers, FaBox,
  FaWallet, FaPercentage, FaFileInvoiceDollar, FaHourglassHalf,FaShieldAlt
} from "react-icons/fa";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement, Filler
);

export default function DashboardHome({ setActiveTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  // 1. State for Time Filter (Year, Month, Week)
  const [timeFilter, setTimeFilter] = useState("This Year");

  // 2. State for Dataset Toggles (Visibility)
  const [showInhouse, setShowInhouse] = useState(true);
  const [showVendor, setShowVendor] = useState(true);

  const [showInhouseEarning, setShowInhouseEarning] = useState(true);
  const [showVendorEarning, setShowVendorEarning] = useState(true);
  const [showCommission, setShowCommission] = useState(true);



  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);


        const periodMap = {
          "This Year": "yearly",
          "This Month": "monthly",
          "This Week": "weekly"
        };

        const period = periodMap[timeFilter] || "monthly";

        const data = await fetchFromAPI(`/dashboard?period=${period}`);

        // ✅ SAFE DATA STRUCTURE
        setStats({
          orderStatus: data?.orderStatus || {},
          totalStores: data?.totalStores || 0,
          totalProducts: data?.totalProducts || 0,
          totalCustomers: data?.totalCustomers || 0,
          labels: data?.labels || [],
          inhouseData: data?.inhouseData || [],
          vendorData: data?.vendorData || [],
          earningLabels: data?.earningLabels || [],
          inhouseEarningData: data?.inhouseEarningData || [],
          vendorEarningData: data?.vendorEarningData || [],
          commissionData: data?.commissionData || [],
          wallet: data?.wallet || {},
          topCustomers: data?.topCustomers || [],
          popularStores: data?.popularStores || [],
          topSellingStores: data?.topSellingStores || [],
          popularProducts: data?.popularProducts || [],
          topSellingProducts: data?.topSellingProducts || [],
          topDeliveryMen: data?.topDeliveryMen || [],
          vendors: data?.vendors || 0,
          delivery: data?.delivery || 0,
          customers: data?.customers || 0,
          pendingVendorsCount: data?.pendingVendorsCount || 0,
          pendingProductsCount: data?.pendingProductsCount || 0
        });

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeFilter]);

  const chartData = useMemo(() => {
    return {
      labels: stats?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Inhouse',
          data: stats?.inhouseData || [0, 400, 100, 200, 50, 150, 0, 0, 0, 0, 0, 0],
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
          tension: 0.4,
          hidden: !showInhouse, // Toggle visibility
        },
        {
          label: 'Vendor',
          data: stats?.vendorData || [0, 10, 50, 20, 100, 300, 100, 0, 0, 0, 0, 0],
          borderColor: '#82ca9d',
          backgroundColor: 'rgba(130, 202, 157, 0.1)',
          fill: true,
          tension: 0.4,
          hidden: !showVendor, // Toggle visibility
        }
      ]
    };
  }, [stats, showInhouse, showVendor]);

  //  useMemo block above your 'if (loading)'
  const earningChartData = useMemo(() => {
    return {
      labels: stats?.earningLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Inhouse',
          data: stats?.inhouseEarningData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
          tension: 0.4,
          hidden: !showInhouseEarning,
        },
        {
          label: 'Vendor',
          data: stats?.vendorEarningData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: '#82ca9d',
          backgroundColor: 'transparent',
          tension: 0.4,
          hidden: !showVendorEarning,
        },
        {
          label: 'Commission',
          data: stats?.commissionData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: '#ffc107',
          backgroundColor: 'transparent',
          tension: 0.4,
          hidden: !showCommission,
        }
      ]
    };
  }, [stats, showInhouseEarning, showVendorEarning, showCommission]);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-[#f8f9fb] min-h-screen animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#334257]">Welcome Mantra Family</h1>
          <p className="text-sm text-gray-500 font-medium">Monitor your business analytics and statistics.</p>
        </div>
      </div>

      {/* 🌟 NEW: ADMINISTRATIVE GATEKEEPER MODERATION STATUS NOTICES */}
      {(stats?.pendingVendorsCount > 0 || stats?.pendingProductsCount > 0) && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm"><FaShieldAlt size={18} /></div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">Ecosystem Verification Notices</h4>
              <p className="text-xs text-amber-700">Platform items are locked and awaiting authorization approvals.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {stats?.pendingVendorsCount > 0 && (
              <button onClick={() => setActiveTab("pending_vendors")} className="flex-1 sm:flex-none text-xs font-bold bg-white text-amber-700 border border-amber-200 px-3 py-2 rounded-xl shadow-sm hover:bg-amber-100 transition-colors">
                ⚠️ {stats.pendingVendorsCount} Pending Vendors
              </button>
            )}
            {stats?.pendingProductsCount > 0 && (
              <button onClick={() => setActiveTab("product_moderation")} className="flex-1 sm:flex-none text-xs font-bold bg-amber-600 text-white px-3 py-2 rounded-xl shadow-sm hover:bg-amber-700 transition-colors">
                📦 {stats.pendingProductsCount} Products Under Review
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- BUSINESS ANALYTICS SECTION --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500"><FaChartLine size={20} /></div>
            <h2 className="text-lg font-bold text-[#334257]">Business Analytics</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total order" value={stats?.orderStatus?.all} icon={<FaBox className="text-orange-400" />} onClick={() => setActiveTab("orders")} />
          <StatCard title="Total Stores" value={stats?.totalStores || 0} icon={<FaStore className="text-blue-400" />} onClick={() => setActiveTab("stores")} />
          <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={<FaBoxOpen className="text-purple-400" />} onClick={() => setActiveTab("product_list")} />
          <StatCard title="Total Customers" value={stats?.totalCustomers || 0} icon={<FaUsers className="text-red-400" />} onClick={() => setActiveTab("customers")} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusItem label="Pending" value={stats?.orderStatus?.pending} icon={<FaRegClock />} color="text-blue-500" bg="bg-blue-50" onClick={() => setActiveTab("orders_pending")} />
          <StatusItem label="Confirmed" value={stats?.orderStatus?.confirmed} icon={<FaCheckCircle />} color="text-green-500" bg="bg-green-50" onClick={() => setActiveTab("orders_confirmed")} />
          <StatusItem label="Packaging" value={stats?.orderStatus?.packaging} icon={<FaBoxOpen />} color="text-orange-500" bg="bg-orange-50" onClick={() => setActiveTab("orders_packaging")} />
          <StatusItem label="Out for delivery" value={stats?.orderStatus?.out_for_delivery || 0} icon={<FaTruck />} color="text-emerald-500" bg="bg-emerald-50" onClick={() => setActiveTab("orders_shipping")} />
          <StatusItem label="Delivered" value={stats?.orderStatus?.delivered} icon={<FaCheckCircle />} color="text-blue-600" bg="bg-blue-50" onClick={() => setActiveTab("orders_delivered")} />
          <StatusItem label="Canceled" value={stats?.orderStatus?.canceled || 0} icon={<FaTimesCircle />} color="text-red-500" bg="bg-red-50" onClick={() => setActiveTab("orders_canceled")} />
          <StatusItem label="Returned" value={stats?.orderStatus?.returned || 0} icon={<FaUndo />} color="text-rose-500" bg="bg-rose-50" onClick={() => setActiveTab("orders_returned")} />
          <StatusItem label="Failed to delivery" value={stats?.orderStatus?.failed || 0} icon={<FaExclamationCircle />} color="text-red-400" bg="bg-red-50" onClick={() => setActiveTab("orders_failed")} />
        </div>
      </div>

      {/* --- ADMIN WALLET SECTION (New) --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
            <FaWallet size={20} />
          </div>
          <h2 className="text-lg font-bold text-[#334257]">Admin Wallet</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Large In-House Earning Card */}
          <div className="lg:col-span-1 bg-[#fcfdfe] border border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex items-end gap-1.5 h-12">
              <div className="w-2.5 h-4 bg-blue-200 rounded-t-sm"></div>
              <div className="w-2.5 h-7 bg-blue-300 rounded-t-sm"></div>
              <div className="w-2.5 h-10 bg-blue-400 rounded-t-sm"></div>
              <div className="w-2.5 h-12 bg-blue-500 rounded-t-sm"></div>
            </div>
            <h3 className="text-3xl font-black text-[#334257]">
              ₹ = {(stats?.wallet?.inHouseEarning ?? 0).toFixed(2)}
            </h3>
            <p className="text-sm font-bold text-gray-500 mt-2 uppercase">In-House Earning</p>
          </div>

          {/* Right Side: 2x2 Grid of small cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <WalletCard
              label="Commission Earned"
              value={stats?.wallet?.commissionEarned}
              icon={<FaChartLine className="text-red-400" />}
            />
            <WalletCard
              label="Delivery Charge Earned"
              value={stats?.wallet?.deliveryCharge}
              icon={<FaTruck className="text-orange-400" />}
            />
            <WalletCard
              label="Total Tax Collected"
              value={stats?.wallet?.taxCollected}
              icon={<FaFileInvoiceDollar className="text-emerald-400" />}
            />
            <WalletCard
              label="Pending Amount"
              value={stats?.wallet?.pendingAmount}
              icon={<FaHourglassHalf className="text-green-500" />}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        {/* --- ORDER STATISTICS --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6">
          {/* Header: Stacked on mobile, row on tablet+ */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 md:mb-8">

            {/* Title */}
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl">📊</span>
              <h2 className="text-base md:text-lg font-bold text-[#334257] whitespace-nowrap">Order Statistics</h2>
            </div>

            {/* Controls Group: Dataset Toggles and Time Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">

              {/* Dataset Toggles (Inhouse / Vendor) */}
              <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm font-medium">
                <button
                  onClick={() => setShowInhouse(!showInhouse)}
                  className={`flex items-center gap-1.5 md:gap-2 transition-all duration-200 ${showInhouse ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}
                >
                  <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#007bff]"></span>
                  <span className="text-[#334257]">Inhouse</span>
                </button>
                <button
                  onClick={() => setShowVendor(!showVendor)}
                  className={`flex items-center gap-1.5 md:gap-2 transition-all duration-200 ${showVendor ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}
                >
                  <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#82ca9d]"></span>
                  <span className="text-[#334257]">Vendor</span>
                </button>
              </div>

              {/* Time Filter Tabs: Full width on mobile */}
              <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
                {['This Year', 'This Month', 'This Week'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTimeFilter(tab)}
                    className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all whitespace-nowrap ${timeFilter === tab
                      ? 'bg-white text-[#007bff] shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Container: Responsive Height */}
          <div className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    padding: 10,
                    backgroundColor: '#334257',
                    titleFont: { size: 12 },
                    bodyFont: { size: 12 },
                    cornerRadius: 8
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: '#f3f4f6', drawBorder: false },
                    ticks: {
                      font: { size: 10 },
                      callback: (val) => val >= 1000 ? `₹${val / 1000}k` : `₹${val}`
                    }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 } }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* --- USER OVERVIEW --- */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#334257] mb-8">User Overview</h2>

          <div className="relative h-[250px] flex items-center justify-center">
            <Doughnut
              data={{
                labels: ['Customer', 'Vendor', 'Delivery Man'],
                datasets: [{
                  data: [stats?.totalCustomers || 0, stats?.vendors || 0, stats?.delivery || 0],
                  backgroundColor: ['#007bff', '#66ccff', '#00cccc'],
                  hoverOffset: 4,
                  borderWidth: 0
                }]
              }}
              options={{ cutout: '80%', plugins: { legend: { display: false } } }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-[#334257]">
                {(stats?.customers || 0) + (stats?.vendors || 0) + (stats?.delivery || 0)}
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Users</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <LegendRow color="bg-[#007bff]" label="Customer" count={stats?.customers || 0} />
            <LegendRow color="bg-[#66ccff]" label="Vendor" count={stats?.vendors || 0} />
            <LegendRow color="bg-[#00cccc]" label="Delivery Man" count={stats?.delivery || 0} />
          </div>
        </div>
      </div>

      {/* --- EARNING STATISTICS --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 mt-6">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 md:mb-8">

          {/* Title */}
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl">📈</span>
            <h2 className="text-base md:text-lg font-bold text-[#334257]">Earning Statistics</h2>
          </div>

          {/* Controls: Toggles + Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">

            {/* 3-Way Dataset Toggles */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm font-medium">
              <button
                onClick={() => setShowInhouseEarning(!showInhouseEarning)}
                className={`flex items-center gap-1.5 transition-all ${showInhouseEarning ? 'opacity-100' : 'opacity-30'}`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#007bff] "></span>
                <span className="text-[#334257]">Inhouse</span>
              </button>
              <button
                onClick={() => setShowVendorEarning(!showVendorEarning)}
                className={`flex items-center gap-1.5 transition-all ${showVendorEarning ? 'opacity-100' : 'opacity-30'}`}
              >
                <span className=" text-black w-2.5 h-2.5 rounded-full bg-[#82ca9d]"></span>
                <span className="text-[#334257]">Vendor</span>
              </button>
              <button
                onClick={() => setShowCommission(!showCommission)}
                className={`flex items-center gap-1.5 transition-all ${showCommission ? 'opacity-100' : 'opacity-30'}`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffc107] text-black"></span>
                <span className="text-[#334257]">Commission</span>
              </button>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
              {['This Year', 'This Month', 'This Week'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTimeFilter(tab)}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all ${timeFilter === tab ? 'bg-white text-[#007bff] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
          <Line
            data={earningChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: '#f3f4f6', drawBorder: false },
                  ticks: {
                    font: { size: 10 },
                    callback: (val) => val >= 1000 ? `₹${val / 1000}k` : `₹${val}`
                  }
                },
                x: {
                  grid: { display: false },
                  ticks: { font: { size: 10 } }
                }
              }
            }}
          />
        </div>
      </div>

      {/* --- TOP PERFORMANCE SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

        {/* Top Customers Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 overflow-hidden">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <span className="text-xl">🏅</span>
            <h2 className="text-lg font-bold text-[#334257]">Top Customer</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {stats?.topCustomers?.length > 0 ? stats.topCustomers.map((user, idx) => (
              <div key={idx} className="flex-shrink-0 w-32 bg-gray-50/50 rounded-xl p-4 flex flex-col items-center border border-gray-100">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <span className="text-blue-500 font-bold">{user.name?.charAt(0)}</span>}
                </div>
                <p className="text-sm font-bold text-[#334257] truncate mt-2 w-full text-center">{user.name}</p>
                <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-1 rounded-full border border-blue-100 mt-1">
                  Orders: {user.orderCount}
                </span>
              </div>
            )) : <p className="text-gray-400 text-xs text-center w-full">No customers yet</p>}
          </div>
        </div>

        {/* Most Popular Stores */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <span className="text-xl">🍱</span>
            <h2 className="text-lg font-bold text-[#334257]">Most Popular Stores</h2>
          </div>
          <div className="space-y-4">
            {stats?.popularStores?.length > 0 ? stats.popularStores.map((store, index) => (
              <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100">
                <span className="text-sm font-medium text-gray-700">{store.name}</span>
                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">{store.totalOrders || 0} Orders</span>
              </div>
            )) : <p className="text-gray-400 text-xs">No store data</p>}
          </div>
        </div>

        {/* Top Selling Store */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <span className="text-xl">🏪</span>
            <h2 className="text-lg font-bold text-[#334257]">Top Selling Store</h2>
          </div>
          <div className="space-y-4">
            {stats?.topSellingStores?.length > 0 ? stats.topSellingStores.map((store, index) => (
              <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{store.name}</span>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">₹{store.totalSales?.toLocaleString() || 0}</span>
              </div>
            )) : <p className="text-gray-400 text-xs">No sales data</p>}
          </div>
        </div>
      </div>

      {/* --- LOWER DASHBOARD SECTIONS --- */}
      <div className="flex flex-col gap-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Most Popular Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <span className="text-xl">💟</span>
              <h2 className="text-base font-bold text-[#334257]">Most Popular Products</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats?.popularProducts?.map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 flex flex-col items-center border border-gray-100 hover:shadow-sm transition-shadow">
                  <img src={getImageUrl(item.thumbnail || item.image)} alt={item.name} className="w-16 h-16 object-contain mb-2 rounded-md" />
                  <p className="text-[10px] font-bold text-[#334257] text-center truncate w-full uppercase">{item.name}</p>
                  <p className="text-[9px] text-orange-400 font-bold mt-1">₹ {item.unitPrice || item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <span className="text-xl">📈</span>
              <h2 className="text-base font-bold text-[#334257]">Top Selling Products</h2>
            </div>
            <div className="space-y-4">
              {stats?.topSellingProducts?.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-10 h-10 rounded-lg object-cover border" alt="" />
                    <span className="text-xs font-bold text-[#334257] truncate w-24">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-md">Sold: {item.sold}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Delivery Man */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <span className="text-xl">🎖️</span>
              <h2 className="text-base font-bold text-[#334257]">Top Delivery Man</h2>
            </div>
            <div className="space-y-4">
              {stats?.topDeliveryMen?.map((man, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold overflow-hidden border border-white shadow-sm">
                      {man.image ? <img src={man.image} alt="" className="w-full h-full object-cover" /> : man.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#334257]">{man.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">Top Performer</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{man.orders} Orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>



      {/* --- FULLY RESPONSIVE FOOTER --- */}
      <footer className="mt-auto py-6 px-4 border-t border-gray-100 bg-white/50 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright Section: Centered on mobile, Left-aligned on desktop */}
          <div className="text-gray-500 text-[10px] md:text-sm font-medium text-center sm:text-left order-2 sm:order-1">
            @ CopyRight Mantra   2025
          </div>

          {/* Navigation Links: Centered on mobile, Right-aligned on desktop */}
          <div className="flex items-center gap-6 md:gap-8 order-1 sm:order-2">
            <button
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all group py-2"
            >
              <span className="text-base md:text-lg group-hover:scale-110 transition-transform cursor-pointer">👤</span>
              <span className="text-xs md:text-sm font-bold cursor-pointer">Profile</span>
            </button>

            <button
              onClick={() => {
                // 1. Reset the view to Dashboard
                setActiveTab("dashboard");

                // 2. Find the scrollable container and move it to the top
                const mainArea = document.querySelector("main");
                if (mainArea) {
                  mainArea.scrollTo({
                    top: 0,
                    behavior: "smooth" // Use "auto" for an instant jump like the first load
                  });
                }
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all group py-2"
            >
              <span className="text-base md:text-lg group-hover:scale-110 transition-transform text-[#334257] cursor-pointer">🏠</span>
              <span className="text-xs md:text-sm font-bold cursor-pointer">Home</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

{/* --- HELPER COMPONENT FOR DROPDOWN ITEMS --- */ }
function OrderItem({ label, count, dotColor }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-[#ffffff05] cursor-pointer group transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
        <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
          {label}
        </span>
      </div>
      <span className="text-[10px] font-bold bg-[#3d4b53] text-[#00d084] px-2 py-0.5 rounded-full min-w-[20px] text-center">
        {count}
      </span>
    </div>
  );
}

// --- NEW COMPONENT FOR WALLET CARDS ---
function WalletCard({ label, value, icon }) {
  return (
    <div className="bg-[#fcfdfe] border border-gray-100 rounded-2xl p-6 flex items-center justify-between">
      <div>
        <h3 className="text-xl font-black text-[#334257]"> {(value ?? 0).toFixed(2)}₹</h3>
        <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-tight">{label}</p>
      </div>
      <div className="text-2xl opacity-80 bg-white p-3 rounded-xl shadow-sm border border-gray-50">
        {icon}
      </div>
    </div>
  );
}

// --- EXISTING COMPONENTS ---
function StatCard({ title, value, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-[#f8f9fb]/50 border border-gray-100 rounded-2xl p-6 flex items-start justify-between hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group cursor-pointer active:scale-95"
    >
      <div>
        <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-tight">{title}</p>
        <h3 className="text-4xl font-black text-[#334257]">{value || 0}</h3>
      </div>
      <div className="bg-white p-3.5 rounded-2xl shadow-sm text-2xl group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
    </button>
  );
}

function StatusItem({ label, value, icon, color, bg, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#fcfdfe] border border-gray-100/50 rounded-2xl p-4 flex items-center justify-between hover:bg-white hover:shadow-md hover:border-gray-200 transition-all active:scale-95 cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <span className={`${bg} ${color} p-2.5 rounded-xl text-base shadow-sm group-hover:scale-110 transition-transform`}>{icon}</span>
        <span className="text-sm font-bold text-gray-600">{label}</span>
      </div>
      <span className={`text-lg font-black ${color}`}>{value || 0}</span>
    </button>
  );
}


function LegendRow({ color, label, count }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-gray-500 font-medium">{label}</span>
      </div>
      <span className="font-bold text-[#334257]">({count})</span>
    </div>
  );
}

// Component for the Store rows (used in both Popular and Top Selling)
function StoreRow({ store, isSelling }) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-400 font-bold border border-orange-100">
          {store.name?.charAt(0) || "S"}
        </div>
        <div>
          <p className="text-sm font-bold text-[#334257]">{store.name || "Store Name"}</p>
          <p className="text-[10px] font-medium text-gray-400">ID: {store._id?.slice(-6) || "000000"}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-black ${isSelling ? 'text-green-600' : 'text-blue-600'}`}>
          {isSelling ? `₹${store.totalSales || 0}` : `${store.reviewCount || 0} Reviews`}
        </p>
      </div>
    </div>
  );
}

// Simple Empty State UI
function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 opacity-40">
      <div className="text-4xl mb-2">📥</div>
      <p className="text-xs font-bold uppercase tracking-widest">{message}</p>
    </div>
  );
}

function StoreItem({ name, detail, isSelling }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer p-1">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-sm border border-orange-100 transition-colors group-hover:bg-orange-100">
          {name.charAt(0)}
        </div>
        <span className="text-xs font-bold text-gray-600 group-hover:text-[#334257] transition-colors">{name}</span>
      </div>
      <span className={`text-xs font-black ${isSelling ? 'text-green-600' : 'text-blue-600'}`}>
        {detail}
      </span>
    </div>
  );
}

function EmptyDisplay() {
  return (
    <div className="flex flex-col items-center justify-center py-6 opacity-20">
      <span className="text-3xl">📂</span>
      <p className="text-[10px] font-bold mt-2 uppercase">No Data Found</p>
    </div>
  );
}