"use client";

import React, { useState } from 'react';
import { Search, FileDown, ChevronDown, FolderOpen, CheckCircle2, History } from 'lucide-react';

export default function Refunded() {
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("refunded"); 

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-green-50 rounded-full">
                        <History className="w-5 h-5 text-green-600" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-800">
                        Refunded Requests
                        <span className="ml-2 px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-full text-sm font-semibold">0</span>
                    </h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-5 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-50">
                        <div className="flex w-full md:w-auto border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-100">
                            <div className="flex items-center pl-3 bg-white"><Search className="w-4 h-4 text-slate-400" /></div>
                            <input type="text" placeholder="Search by order id..." className="py-2.5 px-3 outline-none text-sm w-full md:w-72" />
                            <button className="bg-[#0061FF] text-white px-7 py-2.5 text-sm font-medium">Search</button>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1">
                                <button onClick={() => setIsExportOpen(!isExportOpen)} className="w-full flex items-center justify-between gap-2 border border-blue-400 text-blue-600 px-5 py-2.5 rounded-lg text-sm font-semibold">
                                    <span className="flex items-center gap-2"><FileDown className="w-4 h-4" />Export</span>
                                    <ChevronDown className="w-3 h-3" />
                                </button>

                                {/* Status Filter Dropdown */}
                                <div className="relative flex-1 lg:flex-none">
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full appearance-none bg-white border border-slate-300 text-slate-600 py-2.5 pl-4 pr-10 rounded-lg text-sm font-semibold outline-none cursor-pointer focus:border-blue-500"
                                    >
                                        <option value="Refunded">Refunded</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    <div className="hidden md:grid grid-cols-7 bg-[#f1f5f9]/50 px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        <div>SL</div><div>Refund ID</div><div>Order ID</div><div>Product Info</div><div>Customer Info</div><div>Total Amount</div><div className="text-right">Status</div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <div className="relative mb-6">
                            <FolderOpen className="w-32 h-32 text-slate-200 stroke-[1px]" />
                            <div className="absolute bottom-4 right-4 bg-green-500 rounded-full p-2 border-4 border-white"><CheckCircle2 className="w-6 h-6 text-white" /></div>
                        </div>
                        <h3 className="text-slate-600 font-semibold text-xl">No refunded requests</h3>
                        <p className="text-slate-400 text-sm mt-2">Completed transactions will appear here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}