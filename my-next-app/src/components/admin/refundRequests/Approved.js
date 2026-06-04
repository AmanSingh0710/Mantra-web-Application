"use client";

import React, { useState } from 'react';
import { 
  Search, 
  FileDown, 
  ChevronDown, 
  FolderOpen, 
  CheckCircle, 
  LayoutDashboard 
} from 'lucide-react';

export default function Approved() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Approved");

  // Search function placeholder
  const handleSearch = () => {
    console.log("Searching approved requests...");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title & Counter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Approved Refund Requests 
            <span className="ml-2 px-2.5 py-0.5 bg-slate-200 text-slate-600 rounded-full text-sm font-medium">0</span>
          </h1>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Controls Bar: Search, Export & Filter */}
          <div className="p-5 flex flex-col lg:flex-row gap-4 justify-between items-center border-b border-slate-50">
            
            {/* Functional Search Bar */}
            <div className="flex w-full lg:w-auto border border-slate-300 rounded-lg overflow-hidden focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-500 transition-all">
              <div className="flex items-center pl-3 bg-white">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search by order id or refund id"
                className="py-2.5 px-3 outline-none text-sm w-full md:w-80 text-slate-600"
              />
              <button 
                onClick={handleSearch}
                className="bg-[#0061FF] hover:bg-blue-700 text-white px-8 py-2.5 text-sm font-semibold transition-colors active:scale-95"
              >
                Search
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              
              {/* Working Export Dropdown */}
              <div className="relative flex-1 lg:flex-none">
                <button 
                  onClick={() => setIsExportOpen(!isExportOpen)}
                  className="w-full flex items-center justify-between gap-2 border border-blue-400 text-blue-600 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-50 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FileDown className="w-4 h-4" />
                    Export
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`} />
                </button>

                {isExportOpen && (
                  <div className="absolute right-0 mt-2 w-full lg:w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95">
                    <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                      Excel Spreadsheet (.xlsx)
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                      PDF Document (.pdf)
                    </button>
                  </div>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative flex-1 lg:flex-none">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-300 text-slate-600 py-2.5 pl-4 pr-10 rounded-lg text-sm font-semibold outline-none cursor-pointer focus:border-blue-500"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Refunded">Refunded</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>

            </div>
          </div>

          {/* Table Header (Visible only on Desktop) */}
          <div className="hidden lg:grid grid-cols-7 bg-[#f8fafc] px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] border-b border-slate-100">
            <div>SL</div>
            <div>Refund ID</div>
            <div>Order ID</div>
            <div>Product Info</div>
            <div>Customer Info</div>
            <div>Total Amount</div>
            <div className="text-right">Action</div>
          </div>

          {/* Empty State Body */}
          <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="relative mb-8">
              {/* Folder Icon with softer opacity */}
              <div className="w-32 h-32 text-slate-200">
                 <FolderOpen className="w-full h-full stroke-[1.5px]" />
              </div>
              {/* Green Success Badge */}
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2.5 border-[5px] border-white shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            
            <h3 className="text-slate-700 font-bold text-xl">No approved refund request found</h3>
            <p className="text-slate-400 text-sm mt-2 text-center max-w-sm">
              Jab koi refund request approve hogi, toh wo yahan list mein dikhayi degi.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}