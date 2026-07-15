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

const LIMIT = 10;
const TABLE_COLUMNS = ["Order", "Customer", "Amount", "Method", "Payment Status", "Order Status", "Date"];

export default function TransactionReport() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({});
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);

    const [filters, setFilters] = useState({
        search: "",
        paymentMethod: "",
        paymentStatus: "",
        startDate: "",
        endDate: ""
    });

    const fetchReport = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit: LIMIT, ...filters });
            const { data } = await fetchFromAPI(`/admin/reports/transactions?${params}`);

            setTransactions(data?.transactions || []);
            setSummary(data?.summary || {});
            setPagination(data?.pagination || {});
        } catch (err) {
            toast.error(err.message || "Failed to load transaction report");
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
                await downloadFile("/report/transactions/export/excel", "transactions-report.xlsx");
            } else {
                await downloadFile("/report/transactions/export/pdf", "transactions-report.pdf"
                );
            }
        } catch (err) {
            toast.error(err.message || "Download failed");
        }
    };

    const handleUpdateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

    const cards = useMemo(() => [
        { title: "Transactions", value: summary.totalTransactions || 0, change: `${summary.paidTransactions || 0} Paid`, color: "text-blue-600" },
        { title: "Revenue", value: `₹${summary.totalRevenue || 0}`, change: `${summary.onlineTransactions || 0} Online`, color: "text-green-600" },
        { title: "Pending", value: summary.pendingTransactions || 0, change: "Awaiting Payment", color: "text-orange-600" },
        { title: "Failed", value: summary.failedTransactions || 0, change: `${summary.codTransactions || 0} COD`, color: "text-red-600" }
    ], [summary]);

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="space-y-6">
            <ReportHeader
                title="Transaction Report"
                subtitle="Monitor all payment transactions."
                onPrint={window.print}
                onExportPDF={() => handleExport("pdf")}
                onExportExcel={() => handleExport("excel")}
            />

            <KPICards cards={cards} />

            <FilterBar
                search={filters.search}
                setSearch={(val) => handleUpdateFilter("search", val)}
                paymentMethod={filters.paymentMethod}
                setPaymentMethod={(val) => handleUpdateFilter("paymentMethod", val)}
                paymentStatus={filters.paymentStatus}
                setPaymentStatus={(val) => handleUpdateFilter("paymentStatus", val)}
                startDate={filters.startDate}
                setStartDate={(val) => handleUpdateFilter("startDate", val)}
                endDate={filters.endDate}
                setEndDate={(val) => handleUpdateFilter("endDate", val)}
                onApply={() => { setPage(1); fetchReport(); }}
            />

            {transactions.length === 0 ? (
                <EmptyState title="No Transactions Found" />
            ) : (
                <>
                    <ReportTable columns={TABLE_COLUMNS}>
                        {transactions.map((item) => (
                            <tr key={item._id} className="border-t hover:bg-gray-50">
                                <td className="px-5 py-4 font-medium text-gray-900">{item.orderNumber || item._id}</td>
                                <td className="px-5 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.customer?.name || "-"}</p>
                                        <p className="text-xs text-gray-500">{item.customer?.email || ""}</p>
                                    </div>
                                </td>
                                <td className="px-5 py-4 font-semibold text-gray-900">₹{item.totalAmount}</td>
                                <td className="px-5 py-4 text-gray-600">{item.paymentMethod}</td>
                                <td className="px-5 py-4"><StatusBadge status={item.paymentStatus} /></td>
                                <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                                <td className="px-5 py-4 text-gray-500 text-sm">
                                    {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
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