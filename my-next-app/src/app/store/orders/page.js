"use client";
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import StoreTable from "@/components/store/StoreTable";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchFromAPI("/vendor-store/vendor-orders");
        setOrders(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const columns = ["Order ID", "Customer", "Amount", "Status"];

  const tableData = orders.map((order) => ({
    id: <span className="font-black text-gray-900 uppercase">#{order._id.slice(-6)}</span>,
    customer: <span className="font-bold text-gray-600">{order.customerName || "Guest User"}</span>,
    amount: <span className="font-black text-gray-900">₹{order.totalAmount}</span>,
    status: (
      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${
        order.status === "Delivered" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
      }`}>
        {order.status}
      </span>
    )
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Orders</h1>
      {loading ? (
        <div className="p-10 text-center font-bold text-gray-400 animate-pulse">Fetching Orders...</div>
      ) : (
        <StoreTable columns={columns} data={tableData} />
      )}
    </div>
  );
}