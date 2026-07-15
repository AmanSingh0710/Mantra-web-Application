//src/components/admin/reports/EarningReport.js
"use client";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { fetchFromAPI, downloadFile } from "@/utils/api";
import ReportHeader from "./ui/ReportHeader";
import KPICards from "./ui/KPICards";
import FilterBar from "./ui/FilterBar";
import RevenueChart from "./ui/RevenueChart";
import ReportTable from "./ui/ReportTable";
import Pagination from "./ui/Pagination";
import LoadingSkeleton from "./ui/Skeleton";
import EmptyState from "./ui/EmptyState";
import StatusBadge from "./ui/StatusBadge";

export default function EarningReport() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [summary, setSummary] = useState({});
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const fetchReport = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit, search, status, startDate, endDate });
            const response = await fetchFromAPI(`/report/orders?${params}`);
            setOrders(response.data.orders || []);
            setSummary(response.data.summary || {});
            setPagination(response.data.pagination || {});
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Unable to fetch report");
        } finally { setLoading(false); }
    }, [page, search, status, startDate, endDate]);

    useEffect(() => { fetchReport(); }, [fetchReport]);

    const exportExcel = () => downloadFile("/report/orders/export/excel", "orders.xlsx");
    const exportPDF = () => downloadFile("/report/orders/export/pdf", "orders.pdf");
    const printReport = () => { window.print(); };

    const cards = [
        { title: "Total Revenue", value: `₹${summary.totalRevenue || 0}`, change: "+0%", color: "text-green-600" },
        { title: "Today's Revenue", value: `₹${summary.todayRevenue || 0}`, change: "+0%", color: "text-blue-600" },
        { title: "This Month Revenue", value: `₹${summary.thisMonthRevenue || 0}`, change: "+0%", color: "text-indigo-600" },
        { title: "Total Orders", value: summary.totalOrders || 0, change: "+0%", color: "text-orange-600" }
    ];

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="space-y-6">
            <ReportHeader title="Earning Report" subtitle="Revenue, earnings and order analytics." onPrint={printReport} onExportPDF={exportPDF} onExportExcel={exportExcel} />
            <KPICards cards={cards} />
            <FilterBar search={search} setSearch={setSearch} status={status} setStatus={setStatus} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} onApply={() => { setPage(1); fetchReport(); }} />
            <RevenueChart />
            {orders.length === 0 ? (
                <EmptyState title="No Earnings Found" />
            ) : (
                <>
                    <ReportTable columns={["Order", "Customer", "Amount", "Payment", "Status", "Date"]}>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-t hover:bg-gray-50">
                                <td className="px-5 py-4">{order.orderNumber || order._id}</td>
                                <td className="px-5 py-4">{order.shippingAddress?.fullName || order.user?.name || "-"}</td>
                                <td className="px-5 py-4 font-semibold">₹{order.totalAmount}</td>
                                <td className="px-5 py-4">{order.paymentMethod}</td>
                                <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                                <td className="px-5 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </ReportTable>
                    <Pagination currentPage={pagination.page || page} totalPages={pagination.totalPages || 1} onPageChange={(newPage) => setPage(newPage)} />
                </>
            )}
        </div>
    );
}