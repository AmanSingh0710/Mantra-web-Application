"use client"

import { fetchFromAPI } from "@/utils/api";
import React, { useState, useEffect } from 'react';
import { Search, Download, Plus, FileText, Eye, Trash2, Bike } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
//src/components/admin/DeliveryManList.js
export default function DeliveryManList({ setActiveTab }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [deliveryMen, setDeliveryMen] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Data
    const fetchDeliveryMen = async () => {
        try {
            const data = await fetchFromAPI("/deliveryman/list");
            setDeliveryMen(data?.data || []);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveryMen();
    }, []);

    // 2. Delete Logic
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this delivery man?")) {
            try {
                await fetchFromAPI(`/deliveryman/delete/${id}`, {
                    method: "DELETE",
                });

                toast.success("Deleted successfully!");
                fetchDeliveryMen();

            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    };

    // 3. Export Logic
    const handleExport = () => {
        if (deliveryMen.length === 0) return toast.error("No data to export");
        const ws = XLSX.utils.json_to_sheet(deliveryMen);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DeliveryMen");
        XLSX.writeFile(wb, "DeliveryMan_List.xlsx");
    };

    const filteredList = deliveryMen.filter(man =>
        man.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
        man.mobile?.includes(searchTerm)
    );


    return (
        <div className="min-h-screen font-sans">
            {/* Page Title */}
            <div className="flex items-center gap-2 mb-6">
                <Bike className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-[#334257]">
                    Delivery Man
                    <span className="bg-gray-200 text-sm px-2 py-0.5 rounded-full ml-2">
                        {filteredList.length}
                    </span>
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search & Actions Bar */}
                <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b">
                    <div className="relative w-full md:w-96 flex">
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            className="w-full px-4 py-2 border rounded-l-md outline-none text-sm focus:border-blue-400 text-black"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-[#0067FF] text-white px-6 py-2 rounded-r-md text-sm font-medium">Search</button>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleExport} className="border border-blue-400 text-blue-500 px-4 py-2 rounded text-sm flex items-center gap-2 font-medium hover:bg-blue-50 transition-colors">
                            <Download size={16} /> Export <span>▼</span>
                        </button>
                        <button onClick={() => setActiveTab('add_deliveryman')} className="bg-[#0067FF] text-white px-4 py-2 rounded text-sm flex items-center gap-2 font-medium shadow-md hover:bg-blue-700 transition-colors">
                            <Plus size={18} /> Add Delivery Man
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FB] text-sm font-semibold uppercase text-[#334257]">
                            <tr>
                                <th className="px-6 py-4">SL</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4 text-center">Total Deliveries</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="py-10 text-center">Loading...</td></tr>
                            ) : filteredList.length > 0 ? (
                                filteredList.map((man, index) => (
                                    <tr key={man._id} className="hover:bg-gray-50 text-sm">
                                        <td className="px-6 py-4 font-bold text-gray-700">{index + 1}</td>

                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <img
                                                src={man.image?.url || "/no-image.png"}
                                                className="w-8 h-8 rounded-full object-cover"
                                                alt="delivery man"
                                            />

                                            <span className="font-bold text-gray-900">
                                                {man.name}
                                            </span>
                                        </td>


                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 text-xs ">{man.email}</div>
                                            <div className="font-bold text-black">{man.mobile}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-700">
                                            {man.totalDeliveries || 0}
                                        </td>


                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-2">

                                                <button
                                                    onClick={() => console.log("View", man._id)}
                                                    className="p-1.5 border border-blue-100 text-[#0067FF] rounded hover:bg-[#0067FF] hover:text-white transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                {/* Trash Icon styled like the screenshot */}
                                                <button
                                                    onClick={() => handleDelete(man._id)}
                                                    className="p-1.5 border border-red-100 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="bg-gray-50 p-8 rounded-2xl">
                                                <FileText size={60} className="text-gray-200" />
                                            </div>
                                            <p className="text-gray-400 font-medium">No delivery man found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}