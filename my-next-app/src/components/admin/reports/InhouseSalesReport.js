"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";
import ReportHeader from "./ui/ReportHeader";
import KPICards from "./ui/KPICards";
import FilterBar from "./ui/FilterBar";
import RevenueChart from "./ui/RevenueChart";
import ReportTable from "./ui/ReportTable";
import Pagination from "./ui/Pagination";
import LoadingSkeleton from "./ui/Skeleton";
import EmptyState from "./ui/EmptyState";
import StatusBadge from "./ui/StatusBadge";

export default function InhouseSalesReport() {
    const [loading, setLoading] = useState(true);
    const [sales, setSales] = useState([]);
    const [summary, setSummary] = useState({});
    const [chart, setChart] = useState([]);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const fetchReport = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit, search, startDate, endDate });
            const res = await fetchFromAPI(`/report/inhouse-sales?${params}`);
            setSales(res.data.sales || []);
            setSummary(res.data.summary || {});
            setChart(res.data.chart || []);
            setPagination(res.data.pagination || {});
        } catch (err) {
            toast.error(err.message || "Failed to fetch report");
        } finally { setLoading(false); }
    }, [page, search, startDate, endDate]);

    useEffect(() => { fetchReport(); }, [fetchReport]);

    const exportExcel = () => downloadFile("/report/inhouse-sales/export/excel", "orders.xlsx");
    const exportPDF = () => downloadFile("/report/inhouse-sales/export/pdf", "orders.pdf");
    const printReport = () => { window.print(); };

    const cards = [
        { title: "Revenue", value: `₹${summary.totalRevenue || 0}`, change: `${summary.totalOrders || 0} Orders`, color: "text-green-600" },
        { title: "Products Sold", value: summary.productsSold || 0, change: "Delivered Items", color: "text-blue-600" },
        { title: "Average Order", value: `₹${summary.averageOrderValue || 0}`, change: "Per Order", color: "text-purple-600" },
        { title: "Delivered Orders", value: summary.totalOrders || 0, change: "Completed", color: "text-orange-600" }
    ];

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="space-y-6">
            <ReportHeader title="Inhouse Sales Report" subtitle="Monitor delivered sales and revenue." onPrint={printReport} onExportPDF={exportPDF} onExportExcel={exportExcel} />
            <KPICards cards={cards} />
            <FilterBar search={search} setSearch={setSearch} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} onApply={() => { setPage(1); fetchReport(); }} />
            <RevenueChart data={chart} />
            {sales.length === 0 ? (
                <EmptyState title="No Inhouse Sales Found" />
            ) : (
                <>
                    <ReportTable columns={["Order", "Customer", "Products", "Revenue", "Payment", "Status", "Date"]}>
                        {sales.map(order => (
                            <tr key={order._id} className="border-t hover:bg-gray-50">
                                <td className="px-5 py-4 font-medium">{order.orderNumber || order._id}</td>
                                <td className="px-5 py-4">{order.customer?.name || order.user?.name || order.shippingAddress?.fullName || "-"}</td>
                                <td className="px-5 py-4">{order.products?.length || 0}</td>
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
                    <Pagination currentPage={pagination.page || 1} totalPages={pagination.totalPages || 1} onPageChange={setPage} />
                </>
            )}
        </div>
    );
}