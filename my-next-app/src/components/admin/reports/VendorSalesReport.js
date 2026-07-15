"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";
import ReportHeader from "./ui/ReportHeader";
import KPICards from "./ui/KPICards";
import FilterBar from "./ui/FilterBar";
import ReportTable from "./ui/ReportTable";
import Pagination from "./ui/Pagination";
import LoadingSkeleton from "./ui/Skeleton";
import EmptyState from "./ui/EmptyState";
import StatusBadge from "./ui/StatusBadge";
import RevenueChart from "./ui/RevenueChart";

const LIMIT = 10;
const TABLE_COLUMNS = ["Vendor", "Store", "Products", "Orders", "Revenue", "Status", "Joined"];

export default function VendorSalesReport() {
    const [loading, setLoading] = useState(true);
    const [vendors, setVendors] = useState([]);
    const [summary, setSummary] = useState({});
    const [chart, setChart] = useState([]);
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        startDate: "",
        endDate: ""
    });

    const fetchReport = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit: LIMIT, ...filters });
            const { data } = await fetchFromAPI(`/report/vendor-sales?${params}`);

            setVendors(data?.vendors || []);
            setSummary(data?.summary || {});
            setChart(data?.chart || []);
            setPagination(data?.pagination || {});
        } catch (err) {
            toast.error(err.message || "Failed to fetch vendor sales report");
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const handleExport = async (type) => {
        try {
            if (type === "excel") {
                await downloadFile("/report/vendor-sales/export/excel", "vendor-sales-report.xlsx");
            } else {
                await downloadFile("/report/vendor-sales/export/pdf", "vendor-sales-report.pdf"
                );
            }
        } catch (err) {
            toast.error(err.message || "Download failed");
        }
    };
    const handleUpdateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

    const cards = useMemo(() => [
        { title: "Total Vendors", value: summary.totalVendors || 0, change: `${summary.activeVendors || 0} Active`, color: "text-blue-600" },
        { title: "Revenue", value: `₹${summary.totalRevenue || 0}`, change: `${summary.totalOrders || 0} Orders`, color: "text-green-600" },
        { title: "Products Sold", value: summary.totalProducts || 0, change: "Total Products", color: "text-purple-600" },
        { title: "Average Sale", value: `₹${summary.averageSale || 0}`, change: "Per Vendor", color: "text-orange-600" }
    ], [summary]);

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="space-y-6">
            <ReportHeader
                title="Vendor Sales Report"
                subtitle="Monitor vendor sales performance and revenue."
                onPrint={window.print}
                onExportPDF={() => handleExport("pdf")}
                onExportExcel={() => handleExport("excel")}
            />

            <KPICards cards={cards} />

            <FilterBar
                search={filters.search}
                setSearch={(val) => handleUpdateFilter("search", val)}
                status={filters.status}
                setStatus={(val) => handleUpdateFilter("status", val)}
                startDate={filters.startDate}
                setStartDate={(val) => handleUpdateFilter("startDate", val)}
                endDate={filters.endDate}
                setEndDate={(val) => handleUpdateFilter("endDate", val)}
                onApply={() => { setPage(1); fetchReport(); }}
            />

            <RevenueChart data={chart} />

            {vendors.length === 0 ? (
                <EmptyState title="No Vendor Sales Found" />
            ) : (
                <>
                    <ReportTable columns={TABLE_COLUMNS}>
                        {vendors.map((vendor) => (
                            <tr key={vendor._id} className="border-t hover:bg-gray-50">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={vendor.image || vendor.avatar || "/placeholder.png"}
                                            alt={vendor.name}
                                            className="w-12 h-12 rounded-full border object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{vendor.name}</p>
                                            <p className="text-xs text-gray-500">{vendor.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-gray-600">
                                    {vendor.storeName || vendor.store?.storeName || "-"}
                                </td>
                                <td className="px-5 py-4 text-center text-gray-600">{vendor.totalProducts || 0}</td>
                                <td className="px-5 py-4 text-center text-gray-600">{vendor.totalOrders || 0}</td>
                                <td className="px-5 py-4 font-semibold text-gray-900">₹{vendor.totalRevenue || 0}</td>
                                <td className="px-5 py-4">
                                    <StatusBadge status={vendor.status} />
                                </td>
                                <td className="px-5 py-4 text-gray-500 text-sm">
                                    {new Date(vendor.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                </td>
                            </tr>
                        ))}
                    </ReportTable>

                    <Pagination
                        currentPage={pagination.page || 1}
                        totalPages={pagination.totalPages || 1}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}