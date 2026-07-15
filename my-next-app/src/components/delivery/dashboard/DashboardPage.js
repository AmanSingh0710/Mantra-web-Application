"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";
import RecentOrders from "./RecentOrders";
import QuickActions from "./QuickActions";

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [analytics, setAnalytics] = useState([]);

    const loadDashboard = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }
            const [statsRes, ordersRes, analyticsRes] = await Promise.all([
                fetchFromAPI("/deliveryBoy/my-stats"),
                fetchFromAPI("/deliveryBoy/my-orders"),
                fetchFromAPI("/deliveryBoy/analytics")
            ]);

            setAnalytics(Array.isArray(analyticsRes?.analytics) ? analyticsRes.analytics: []);
            setStats(statsRes || {});
            setOrders(Array.isArray(ordersRes?.orders)? ordersRes.orders.slice(0, 5): []);
        } catch (error) {
            toast.error(error.message ||"Failed to load dashboard");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard(true);
    }, [loadDashboard]);

    useEffect(() => {
        const interval = setInterval(() => {
            loadDashboard(false);
        }, 30000);
        return () => clearInterval(interval);
    }, [loadDashboard]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh] w-full px-4">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        /* Root layout wrapper with responsive padding and spacing */
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Header Component */}
            <DashboardHeader
                refreshing={refreshing}
                onRefresh={() => loadDashboard(false)}
            />
            
            {/* Stats Section */}
            <DashboardStats
                stats={stats}
            />
            
            {/* Charts Section */}
            <DashboardCharts
                analytics={analytics}
            />
            
            {/* Responsive grid for the bottom sections: stacks on small screens, splits 2-column on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 w-full overflow-hidden">
                    <RecentOrders orders={orders} />
                </div>
                <div className="w-full">
                    <QuickActions />
                </div>
            </div>
            
        </div>
    );
}