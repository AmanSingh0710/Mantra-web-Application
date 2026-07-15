"use client";

//src/components/admin/reports/OrderReport.js
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchFromAPI, downloadFile } from "@/utils/api";
import ReportHeader from "./ui/ReportHeader";
import KPICards from "./ui/KPICards";
import FilterBar from "./ui/FilterBar";
import ReportTable from "./ui/ReportTable";
import Pagination from "./ui/Pagination";
import LoadingSkeleton from "./ui/Skeleton";
import EmptyState from "./ui/EmptyState";
import StatusBadge from "./ui/StatusBadge";

export default function OrderReport() {
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
            toast.error(error.message || "Unable to load report.");
        } finally { setLoading(false); }
    }, [page, search, status, startDate, endDate]);

    useEffect(() => { fetchReport(); }, [fetchReport]);

    const exportExcel = () => downloadFile("/report/orders/export/excel", "orders.xlsx");
    const exportPDF = () => downloadFile("/report/orders/export/pdf", "orders.pdf");
    const printReport = () => { window.print(); };

    const cards = [
        { title: "Total Orders", value: summary.totalOrders || 0, change: `${summary.pendingOrders || 0} Pending`, color: "text-blue-600" },
        { title: "Revenue", value: `₹${summary.totalRevenue || 0}`, change: `${summary.deliveredOrders || 0} Delivered`, color: "text-green-600" },
        { title: "Today's Orders", value: summary.todayOrders || 0, change: `₹${summary.todayRevenue || 0}`, color: "text-purple-600" },
        { title: "This Month", value: summary.thisMonthOrders || 0, change: `₹${summary.thisMonthRevenue || 0}`, color: "text-orange-600" }
    ];

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="space-y-6">
            <ReportHeader title="Order Report" subtitle="Track all orders, revenue and order status." onPrint={printReport} onExportPDF={exportPDF} onExportExcel={exportExcel} />
            <KPICards cards={cards} />
            <FilterBar search={search} setSearch={setSearch} status={status} setStatus={setStatus} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} onApply={() => { setPage(1); fetchReport(); }} />
            {orders.length === 0 ? (
                <EmptyState title="No Orders Found" />
            ) : (
                <>
                    <ReportTable columns={["Order ID", "Customer", "Amount", "Payment", "Status", "Date"]}>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-t hover:bg-gray-50 transition">
                                <td className="px-5 py-4 font-medium">{order.orderNumber || order._id}</td>
                                <td className="px-5 py-4">{order.customer?.name || order.user?.name || order.shippingAddress?.fullName || "-"}</td>
                                <td className="px-5 py-4 font-semibold">₹{order.totalAmount}</td>
                                <td className="px-5 py-4">
                                    <div>
                                        <p>{order.paymentMethod}</p>
                                        <p className="text-xs text-gray-500">{order.paymentStatus}</p>
                                    </div>
                                </td>
                                <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                                <td className="px-5 py-4">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                            </tr>
                        ))}
                    </ReportTable>
                    <Pagination currentPage={pagination.page || page} totalPages={pagination.totalPages || 1} onPageChange={(newPage) => setPage(newPage)} />
                </>
            )}
        </div>
    );
}