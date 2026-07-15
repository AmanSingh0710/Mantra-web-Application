"use client";

import { useState, useEffect, useCallback } from "react";
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

export default function ProductReport() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [summary, setSummary] = useState({});
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ search: "", status: "", startDate: "", endDate: "" });

    const LIMIT = 10;

    const fetchReport = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit: LIMIT, ...filters });
            const { data } = await fetchFromAPI(`/report/products?${params}`);

            setProducts(data?.products || []);
            setSummary(data?.summary || {});
            setPagination(data?.pagination || {});
        } catch (err) {
            toast.error(err.message || "Failed to load product report");
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
                await downloadFile("/report/products/export/excel","product-report.xlsx");
            } else {
                await downloadFile("/report/products/export/pdf","product-report.pdf"
                );
            }
        } catch (err) {
            toast.error(err.message || "Download failed");
        }
    };
    const handleUpdateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

    const cards = [
        { title: "Total Products", value: summary.totalProducts || 0, change: `${summary.activeProducts || 0} Active`, color: "text-blue-600" },
        { title: "Inventory Value", value: `₹${summary.inventoryValue || 0}`, change: `${summary.totalStock || 0} Units`, color: "text-green-600" },
        { title: "Low Stock", value: summary.lowStockProducts || 0, change: "Need Restock", color: "text-orange-600" },
        { title: "Out Of Stock", value: summary.outOfStockProducts || 0, change: `${summary.inactiveProducts || 0} Inactive`, color: "text-red-600" }
    ];

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="space-y-6">
            <ReportHeader
                title="Product Report"
                subtitle="Monitor all products, inventory and stock."
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

            {products.length === 0 ? (
                <EmptyState title="No Products Found" />
            ) : (
                <>
                    <ReportTable columns={["Image", "Product", "Category", "Store", "Price", "Stock", "Status", "Created"]}>
                        {products.map((product) => (
                            <tr key={product._id} className="border-t hover:bg-gray-50">
                                <td className="px-5 py-4">
                                    <img
                                        src={product.thumbnail?.url || product.images?.[0] || "/placeholder.png"}
                                        alt={product.productName}
                                        className="w-14 h-14 rounded-lg object-cover border"
                                    />
                                </td>
                                <td className="px-5 py-4">
                                    <div>
                                        <p className="font-semibold text-gray-900">{product.productName}</p>
                                        <p className="text-xs text-gray-500">{product.brand?.name || "-"}</p>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-gray-600">{product.category?.name || "-"}</td>
                                <td className="px-5 py-4 text-gray-600">{product.store?.shopName || "-"}</td>
                                <td className="px-5 py-4 font-semibold text-gray-900">₹{product.price}</td>
                                <td className={`px-5 py-4 font-semibold ${product.stock <= 10 ? "text-red-600" : "text-green-600"}`}>
                                    {product.stock}
                                </td>
                                <td className="px-5 py-4">
                                    <StatusBadge status={product.status} />
                                </td>
                                <td className="px-5 py-4 text-gray-500 text-sm">
                                    {new Date(product.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
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