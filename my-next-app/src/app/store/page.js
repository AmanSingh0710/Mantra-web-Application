"use client";

import { useEffect, useState } from "react";
import {
  fetchFromAPI,
  getImageUrl,
} from "@/utils/api";

import StoreTopbar from "@/components/store/StoreTopbar";
import StoreTable from "@/components/store/StoreTable";
import StoreCard from "@/components/store/StoreCard";

import {
  FaStore,
  FaUsers,
  FaBox,
  FaChartLine,
} from "react-icons/fa";

export default function StorePage() {

  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState({
    totalShops: 0,
    inventory: 0,
    vendors: 0,
    growth: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const getDashboardData = async () => {

      try {

        // ================= STORE DATA =================
        const storeData = await fetchFromAPI("/vendor-store/my-store");

        setStores([storeData]);

        // ================= DASHBOARD STATS =================
        const statsData = await fetchFromAPI("/vendor-store/my-store/vendor-stats");

        setStats(statsData);

      } catch (error) {

        console.error(error.message);

      } finally {

        setLoading(false);

      }
    };

    getDashboardData();

  }, []);

  const columns = ["Shop Details", "Owner", "Contact", "Status"];

  const tableData = stores.map((store) => ({
    shop: (
      <div className="flex items-center gap-3">

        {/* STORE LOGO */}
        <img
          src={getImageUrl(store.shopLogo)}
          className="w-10 h-10 rounded-xl object-cover border bg-white"
          alt="logo"
        />

        <span className="font-bold text-gray-900">
          {store.shopName}
        </span>

      </div>
    ),

    // ================= OWNER WITH IMAGE =================
    owner: (
      <div className="flex items-center gap-3">

        <img
          src={getImageUrl(store.owner?.image)}
          className="w-10 h-10 rounded-full object-cover border"
          alt="owner"
        />

        <span className="font-bold text-gray-900">
          {store.owner?.firstName}{" "}
          {store.owner?.lastName}
        </span>

      </div>
    ),

    contact: (
      <div className="text-xs">

        <p className="font-bold text-gray-700">
          {store.mobile}
        </p>

        <p className="text-gray-400">
          {store.email}
        </p>

      </div>
    ),

    status: (
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${store.status === "Active"
            ? "bg-green-50 text-green-600 border-green-100"
            : "bg-red-50 text-red-600 border-red-100"
          }`}
      >
        {store.status}
      </span>
    ),
  }));

  return (
    <div className="space-y-8 animate-fadeIn">

      <StoreTopbar />

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-black">

        <StoreCard
          title="Total Shops"
          value={stats.totalShops}
          variant="blue"
          icon={<FaStore />}
          isLoading={loading}
        />

        <StoreCard
          title="Inventory"
          value={stats.inventory}
          variant="indigo"
          icon={<FaBox />}
          isLoading={loading}
        />

        <StoreCard
          title="Vendors"
          value={stats.vendors}
          variant="orange"
          icon={<FaUsers />}
          isLoading={loading}
        />

        <StoreCard
          title="Growth"
          value={`${stats.growth}%`}
          variant="green"
          icon={<FaChartLine />}
          isLoading={loading}
        />

      </div>

      {/* STORE TABLE */}
      <div className="space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-gray-900">

          <h2 className="text-2xl font-black text-gray-900 tracking-tight text-center sm:text-left">
            Registered Stores
          </h2>

        </div>

        <StoreTable
          columns={columns}
          data={tableData}
        />

      </div>
    </div>
  );
}