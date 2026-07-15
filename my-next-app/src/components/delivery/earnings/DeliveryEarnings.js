// components/delivery/earnings/DeliveryEarnings.jsx
"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";
import EarningsChart from "./EarningsChart";

function Card({ title, value }) {
    return <div className="bg-white border rounded-xl p-5"><p className="text-sm text-gray-500">{title}</p><h3 className="text-2xl font-bold mt-2">₹{value}</h3></div>;
}

export default function DeliveryEarnings() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            setLoading(true);
            const r = await fetchFromAPI("/deliveryBoy/earnings");
            setData(r.data || r);
        } catch (e) { toast.error("Failed to load earnings"); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    if (loading) return <div className="bg-white border rounded-xl p-6">Loading...</div>;

    return (
        <div className="space-y-6 text-gray-900">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Delivery Earnings</h1>
                <button onClick={load} className="border rounded-lg px-4 py-2 flex gap-2"><RefreshCw size={18} />Refresh</button>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
                <Card title="Today" value={data.today} />
                <Card title="Weekly" value={data.week} />
                <Card title="Monthly" value={data.month} />
                <Card title="Total" value={data.total} />
            </div>

            <EarningsChart data={data.chart || []} />
        </div>
    );
}
