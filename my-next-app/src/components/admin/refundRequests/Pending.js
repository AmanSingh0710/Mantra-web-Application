"use client";

import React, { useState, useEffect } from 'react';
import {
    Search,
    FileDown,
    ChevronDown,
    FolderOpen,
    AlertTriangle,
    LayoutDashboard,
    Trash2,
    CheckCircle,
    XCircle
} from 'lucide-react';

export default function Pending() {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("Pending"); 

    // 1. Data Fetch: Sirf 'pending' status wala data
    const fetchPendingRefunds = async (query = "") => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/refund?status=pending&search=${query}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                setRefunds(result.data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRefunds();
    }, []);

    // 2. Handle Status Change (Approve ya Reject)
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/refund/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Optimistic UI: Pending list se nikaal do kyunki status badal gaya
                setRefunds(prev => prev.filter(item => item._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // 3. Delete Function
    const handleDelete = async (id) => {
        if (!window.confirm("Kyan aap ise delete karna chahte hain?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/refund/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setRefunds(prev => prev.filter(item => item._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto">

                {/* Header with Counter */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <LayoutDashboard className="w-5 h-5 text-blue-600" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800">
                        Pending Refund Requests
                        <span className="ml-2 px-2.5 py-0.5 bg-slate-200 text-slate-600 rounded-full text-sm font-medium">
                            {refunds.length}
                        </span>
                    </h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* Action Bar */}
                    <div className="p-5 flex flex-col lg:flex-row gap-4 justify-between items-center border-b border-slate-50">
                        <div className="flex w-full lg:w-auto border border-slate-300 rounded-lg overflow-hidden focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                            <div className="flex items-center pl-3 bg-white">
                                <Search className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search Pending Orders..."
                                className="py-2.5 px-3 outline-none text-sm w-full md:w-80 text-slate-600"
                            />
                            <button
                                onClick={() => fetchPendingRefunds(search)}
                                className="bg-[#0061FF] hover:bg-blue-700 text-white px-8 py-2.5 text-sm font-semibold transition-colors active:scale-95"
                            >
                                Search
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsExportOpen(!isExportOpen)}
                                className="flex items-center gap-2 border border-blue-400 text-blue-600 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-50"
                            >
                                <FileDown className="w-4 h-4" /> Export
                            </button>

                            {/* Status Filter Dropdown */}
                            <div className="relative flex-1 lg:flex-none">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full appearance-none bg-white border border-slate-300 text-slate-600 py-2.5 pl-4 pr-10 rounded-lg text-sm font-semibold outline-none cursor-pointer focus:border-blue-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Refunded">Refunded</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[1000px]">
                            <div className="grid grid-cols-7 bg-[#f8fafc] px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                                <div>SL</div>
                                <div>Refund ID</div>
                                <div>Order ID</div>
                                <div>Product</div>
                                <div>Customer</div>
                                <div>Total Amount</div>
                                <div className="text-right">Action</div>
                            </div>

                            {loading ? (
                                <div className="p-20 text-center text-slate-400">Loading Pending Requests...</div>
                            ) : refunds.length > 0 ? (
                                refunds.map((item, index) => (
                                    <div key={item._id} className="grid grid-cols-7 px-6 py-4 items-center border-b border-slate-50 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                        <div className="font-medium text-slate-400">{index + 1}</div>
                                        <div className="text-blue-600 font-semibold">{item.refundId}</div>
                                        <div className="font-medium">{item.orderId}</div>
                                        <div className="truncate pr-4">{item.productInfo?.name || "N/A"}</div>
                                        <div>{item.customerInfo?.name || "Customer"}</div>
                                        <div className="font-bold text-slate-800">${item.totalAmount}</div>
                                        <div className="flex justify-end gap-2">
                                            {/* APPROVE BUTTON */}
                                            <button
                                                onClick={() => handleUpdateStatus(item._id, 'approved')}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                title="Approve"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            {/* REJECT BUTTON */}
                                            <button
                                                onClick={() => handleUpdateStatus(item._id, 'rejected')}
                                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                                                title="Reject"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                            {/* DELETE BUTTON */}
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                /* EMPTY STATE (As per your screenshot) */
                                <div className="flex flex-col items-center justify-center py-24">
                                    <div className="relative mb-6">
                                        <FolderOpen className="w-32 h-32 text-slate-100" />
                                        <div className="absolute bottom-4 right-4 bg-slate-400 rounded-full p-2 border-4 border-white">
                                            <AlertTriangle className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-slate-500 font-medium text-lg">No pending refund request found</h3>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}