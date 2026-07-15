"use client";
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response = await fetchFromAPI("/user/dashboard");
            if (!response.success) throw new Error(response.message);
            setDashboard(response);
        } catch (error) {
            toast.error(error.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDashboard(); }, []);

    if (loading) return <div className="p-6">Loading...</div>;
    return (
        <div className="space-y-8 text-black">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Hello, {dashboard?.user?.name}</h1>
                <p className="text-gray-500 mt-2">Welcome back to your account.</p>
            </div>
            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="border rounded-xl p-5">
                    <h3 className="text-gray-500">Total Orders</h3>
                    <p className="text-3xl font-bold mt-2">{dashboard?.stats?.totalOrders}</p>
                </div>
                <div className="border rounded-xl p-5">
                    <h3 className="text-gray-500">Pending Orders</h3>
                    <p className="text-3xl font-bold mt-2">{dashboard?.stats?.pendingOrders}</p>
                </div>
                <div className="border rounded-xl p-5">
                    <h3 className="text-gray-500">Wishlist</h3>
                    <p className="text-3xl font-bold mt-2">{dashboard?.stats?.wishlistCount}</p>
                </div>
                <div className="border rounded-xl p-5">
                    <h3 className="text-gray-500">Notifications</h3>
                    <p className="text-3xl font-bold mt-2">{dashboard?.stats?.notificationCount}</p>
                </div>
            </div>
            {/* Recent Orders */}
            <div className="border rounded-xl p-5">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                    <Link href="/account/MyOreder" className="text-blue-600">View All</Link>
                </div>
                {dashboard?.recentOrders?.length === 0 ? (
                    <p className="text-gray-500 mt-5">No orders found.</p>
                ) : (
                    <div className="mt-5 space-y-4">
                        {dashboard?.recentOrders?.map((order) => (
                            <div key={order._id} className="border rounded-lg p-4 flex justify-between">
                                <div>
                                    <p className="font-semibold">{order.orderNumber}</p>
                                    <p className="text-sm text-gray-500">{order.status}</p>
                                </div>
                                <div className="font-bold">₹{order.pricing?.grandTotal}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-5">
                <Link href="/MyOrder" className="border rounded-xl p-5 text-center">My Orders</Link>
                <Link href="/wishlist" className="border rounded-xl p-5 text-center">Wishlist</Link>
                <Link href="/notifications" className="border rounded-xl p-5 text-center">Notifications</Link>
            </div>
        </div>
    );
}