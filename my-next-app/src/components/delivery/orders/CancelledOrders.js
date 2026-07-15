"use client";
import ActiveOrders from "./ActiveOrders";
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import OrderCard from "./OrderCard";
import OrderDetails from "./OrderDetails";
import toast from "react-hot-toast";

export default function CancelledOrders() {
    const [orders, setOrders] = useState([]); const [selected, setSelected] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const r = await fetchFromAPI("/deliveryBoy/orders/cancelled");
                const d = r.data || r; setOrders(d.orders || []);
            } catch { toast.error("Failed to load"); }
        })();
    }, []);
    if (selected) return <OrderDetails order={selected} onBack={() => setSelected(null)} />;
    return <div className="space-y-4">{orders.length ? orders.map(o => <OrderCard key={o._id} order={o} onView={setSelected} />) : <p>No orders found.</p>}</div>;
}
