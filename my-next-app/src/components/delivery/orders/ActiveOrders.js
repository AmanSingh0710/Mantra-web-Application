// components/delivery/orders/ActiveOrders.jsx
"use client";

import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import toast from "react-hot-toast";
import OrderCard from "./OrderCard";
import OrderDetails from "./OrderDetails";

export default function ActiveOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = async (p = page, q = search) => {
    try {
      setLoading(true);
      const res = await fetchFromAPI(`/deliveryBoy/orders/active?page=${p}&search=${encodeURIComponent(q)}`);
      const data = res?.data || res;
      setOrders(data.orders || []);
      setPages(data.totalPages || 1);
    } catch (e) {
      toast.error("Failed to load active orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, ""); }, []);

  if (selected) {
    return <OrderDetails order={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search order..."
          className="border rounded-lg px-4 py-2 w-full md:w-80"
        />
        <div className="flex gap-2">
          <button onClick={() => load(1, search)} className="px-4 py-2 bg-black text-white rounded-lg">Search</button>
          <button onClick={() => load()} className="px-4 py-2 border rounded-lg">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No active orders found.</div>
      ) : (
        <div className="grid gap-6">
          {orders.map(o => <OrderCard key={o._id} order={o} onView={setSelected} />)}
        </div>
      )}

      <div className="flex justify-center items-center gap-3">
        <button disabled={page <= 1} onClick={() => { const n = page - 1; setPage(n); load(n, search); }} className="border px-4 py-2 rounded disabled:opacity-50">Prev</button>
        <span>{page} / {pages}</span>
        <button disabled={page >= pages} onClick={() => { const n = page + 1; setPage(n); load(n, search); }} className="border px-4 py-2 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  )
}
