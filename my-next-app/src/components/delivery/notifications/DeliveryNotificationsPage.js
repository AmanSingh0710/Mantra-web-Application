"use client";
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import toast from "react-hot-toast";

export default function DeliveryNotificationsPage() {

    const [items, setItems] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const r = await fetchFromAPI("/deliveryBoy/notification/delivery");;
                setItems((r.data || r).notifications || []);
            } catch { toast.error("Failed"); }
        })();
    }, []);

    return <div className="bg-white border rounded-xl p-6 text-gray-900">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        {items.length ? items.map(n =>
            <div key={n._id}
                className="border-b py-3">
                <p>{n.title}</p>
                <p className="text-sm text-gray-900">{n.message}</p>
            </div>) :
            <p>No notifications.</p>}
    </div>
}
