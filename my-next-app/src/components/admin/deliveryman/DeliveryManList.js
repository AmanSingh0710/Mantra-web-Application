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
    const [selectedDeliveryMan, setSelectedDeliveryMan] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

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

    // 3. View 
    const handleView = async (id) => {
        try {
            setModalLoading(true);

            const res = await fetchFromAPI(`/deliveryman/get/${id}`);

            setSelectedDeliveryMan(res.deliveryBoy);
            setShowModal(true);

        } catch (error) {
            toast.error("Failed to load details");
        } finally {
            setModalLoading(false);
        }
    };

    // 4. Export Logic
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
                                                    onClick={() => handleView(man._id)}
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

                {showModal && (
                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
                        {/* Modal Container */}
                        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

                            {/* Header - Fixed Dark Text */}
                            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Delivery Man Details
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Content Area - Explicit Scroll & Dark Text */}
                            <div className="p-6 overflow-y-auto bg-white flex-1 text-gray-800">
                                {modalLoading ? (
                                    <div className="py-10 text-center text-gray-500 font-medium">
                                        Loading details...
                                    </div>
                                ) : selectedDeliveryMan ? (
                                    <div className="space-y-6">
                                        {/* Profile Image */}
                                        <div className="flex justify-center">
                                            <img
                                                src={selectedDeliveryMan.image?.url || "/no-image.png"}
                                                className="w-28 h-28 rounded-full object-cover border border-gray-200 shadow-sm"
                                                alt="Profile"
                                            />
                                        </div>

                                        {/* Info Grid - Changed to block/grid format with dark typography */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <label className="text-gray-500 text-xs font-semibold uppercase block mb-1">Name</label>
                                                <p className="font-bold text-gray-900">{selectedDeliveryMan.name || "N/A"}</p>
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 break-all">
                                                <label className="text-gray-500 text-xs font-semibold uppercase block mb-1">Email</label>
                                                <p className="font-medium text-gray-900">{selectedDeliveryMan.email || "N/A"}</p>
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <label className="text-gray-500 text-xs font-semibold uppercase block mb-1">Mobile</label>
                                                <p className="font-bold text-gray-900">{selectedDeliveryMan.mobile || "N/A"}</p>
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <label className="text-gray-500 text-xs font-semibold uppercase block mb-1">Gender</label>
                                                <p className="font-medium text-gray-900 capitalize">{selectedDeliveryMan.gender || "N/A"}</p>
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <label className="text-gray-500 text-xs font-semibold uppercase block mb-1">Vehicle Type</label>
                                                <p className="font-medium text-gray-900 capitalize">{selectedDeliveryMan.vehicleType || "N/A"}</p>
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <label className="text-gray-500 text-xs font-semibold uppercase block mb-1">Vehicle Number</label>
                                                <p className="font-bold text-gray-900 uppercase">{selectedDeliveryMan.vehicleNumber || "N/A"}</p>
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <label className="text-gray-500 text-xs font-semibold uppercase block mb-1">Aadhaar Number</label>
                                                <p className="font-medium text-gray-900">{selectedDeliveryMan.aadhaarNumber || "N/A"}</p>
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <label className="text-gray-500 text-xs font-semibold uppercase block mb-1">Driving License</label>
                                                <p className="font-bold text-gray-900 uppercase">{selectedDeliveryMan.licenseNumber || "N/A"}</p>
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <label className="text-gray-500 text-xs font-semibold uppercase block mb-1">Status</label>
                                                <p className="font-medium text-gray-900 capitalize">{selectedDeliveryMan.status || "N/A"}</p>
                                            </div>

                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <label className="text-gray-500 text-xs font-semibold uppercase block mb-1">Verified Status</label>
                                                <p className={`font-bold ${selectedDeliveryMan.isVerified ? "text-green-600" : "text-amber-600"}`}>
                                                    {selectedDeliveryMan.isVerified ? "Verified" : "Pending"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Documents Display */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                                                Uploaded Documents
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {selectedDeliveryMan.aadhaarFront?.url && (
                                                    <div className="border border-gray-200 rounded p-1 bg-gray-50">
                                                        <p className="text-xs text-center text-gray-500 mb-1">Aadhaar Front</p>
                                                        <img src={selectedDeliveryMan.aadhaarFront.url} className="max-h-32 w-full object-contain rounded mx-auto" alt="Aadhaar Front" />
                                                    </div>
                                                )}
                                                {selectedDeliveryMan.aadhaarBack?.url && (
                                                    <div className="border border-gray-200 rounded p-1 bg-gray-50">
                                                        <p className="text-xs text-center text-gray-500 mb-1">Aadhaar Back</p>
                                                        <img src={selectedDeliveryMan.aadhaarBack.url} className="max-h-32 w-full object-contain rounded mx-auto" alt="Aadhaar Back" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-10 text-center text-gray-500 font-medium">
                                        No profile data available.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}