"use client";

import { fetchFromAPI } from "@/utils/api";
import { useState, useEffect, useCallback } from "react";
import { Edit, Trash2, Search, Download, ChevronDown, Tag, X, Upload, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function BrandManager({ initialView = "list" }) {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [view, setView] = useState(initialView); // 'list' or 'add'
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [formData, setFormData] = useState({ name: "", image: "" });
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        setView(initialView);
        if (initialView === "add") {
            setEditMode(false);
            setFormData({ name: "", image: "" });
        }
    }, [initialView]);

    const fetchBrands = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchFromAPI("/brand");
            setBrands(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error("Failed to load brands");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBrands(); }, [fetchBrands]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = editMode
            ? `/brand/${currentId}`
            : "/brand";

        const method = editMode ? "PUT" : "POST";

        try {
            await fetchFromAPI(endpoint, {
                method,
                body: JSON.stringify(formData),
            });

            toast.success(editMode ? "Brand Updated!" : "Brand Added Successfully!");

            setEditMode(false);
            setFormData({ name: "", image: "" });
            fetchBrands();
            setView("list");

        } catch (err) {
            toast.error("Action failed");
        }
    };

    const handleEditClick = (brand) => {
        setEditMode(true);
        setCurrentId(brand._id);
        setFormData({ name: brand.name, image: brand.image });
        setView("add");
    };

    // Delete Brand 
    const deleteBrand = async (id) => {
        if (!confirm("Are you sure you want to delete this brand?")) return;

        try {
            await fetchFromAPI(`/brand/${id}`, {
                method: "DELETE",
            });

            toast.success("Brand deleted successfully");

            // instant UI update
            setBrands((prev) => prev.filter((b) => b._id !== id));

        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    // Status Toggle
    const handleStatusToggle = async (id, currentStatus) => {
        try {
            await fetchFromAPI(`/brand/status/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: !currentStatus }),
            });

            toast.success(`Brand ${!currentStatus ? "Activated" : "Deactivated"}`);

            setBrands((prev) =>
                prev.map((b) =>
                    b._id === id ? { ...b, status: !currentStatus } : b
                )
            );

        } catch (err) {
            toast.error("Status update failed");
        }
    };

    // --- Export Functions ---
    const exportPDF = () => {
        try {
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text("Brand List Report", 14, 15);

            const rows = brands.map((b, i) => [
                i + 1,
                b.name,
                b.totalProducts || 0,
                b.totalOrders || 0,
                b.status ? "Active" : "Inactive"
            ]);


            autoTable(doc, {
                head: [["SL", "Brand Name", "Total Products", "Total Orders", "Status"]],
                body: rows,
                startY: 25,
                theme: 'grid',
                headStyles: { fillColor: [0, 103, 213] },
            });

            doc.save("Brand_List.pdf");
            toast.success("PDF Downloaded");
        } catch (error) {
            console.error("PDF Error:", error);
            toast.error("Failed to generate PDF");
        }
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(brands);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Brands");
        XLSX.writeFile(wb, "Brands.xlsx");
    };

    const filteredBrands = brands.filter(b =>
        b.name && b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 bg-[#f8f9fb] min-h-screen font-sans">

            {/* --- BRAND SETUP FORM (ADD/EDIT UI) --- */}
            {(view === "add" || editMode) && (
                <div className=" text-black mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <Tag className="text-[#e67e22] fill-[#e67e22]" size={20} />
                        <h1 className="text-lg font-bold text-[#334257]">Brand Setup</h1>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        {/* Language Tabs */}
                        <div className="border-b mb-6">
                            <button className="text-[#0067d5] border-b-2 border-[#0067d5] pb-2 px-4 font-bold text-sm">
                                English(EN)
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Side: Inputs */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Brand Name <span className="text-red-500">*</span> (EN)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ex : LUX"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#0067d5] transition text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Brand Logo <span className="text-red-500">*</span>
                                        <span className="text-[#00b3c5] ml-2 font-normal text-xs">Ratio 1:1 (500 x 500 px)</span>
                                    </label>
                                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                        <input
                                            type="text"
                                            placeholder="Paste Image URL here"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="flex-1 px-4 py-2.5 outline-none text-sm"
                                        />
                                        <button type="button" className="bg-gray-50 border-l px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
                                            Browse
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Preview */}
                            <div className="flex flex-col items-center justify-center lg:items-start">
                                <div className="w-48 h-48 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden relative group">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <Upload size={48} className="text-gray-300" />
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="lg:col-span-2 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => { setFormData({ name: "", image: "" }); setEditMode(false); setView("list"); }}
                                    className="px-8 py-2.5 rounded-lg bg-[#f4f4f4] text-gray-600 font-bold text-sm hover:bg-gray-200 transition"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 rounded-lg bg-[#0067d5] text-white font-bold text-sm hover:bg-blue-700 transition"
                                >
                                    {editMode ? "Update" : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- BRAND LIST SECTION --- */}
            <div className="flex items-center gap-2 mb-4 mt-8">
                <Tag className="text-[#e67e22] fill-[#e67e22]" size={20} />
                <h1 className="text-lg font-bold text-[#334257]">Brand List</h1>
                <span className="bg-[#e1e8ef] text-[#334257] text-xs font-black px-2 py-0.5 rounded-full">
                    {brands.length}
                </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
                {/* Search & Export Buttons */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div className="flex border text-black border-gray-300 rounded-lg overflow-hidden w-full md:w-1/3">
                        <div className="pl-3 flex items-center bg-white"><Search size={16} className="text-gray-400" /></div>
                        <input
                            type="text"
                            value={searchTerm}
                            placeholder="Search by brand name"
                            className="w-full px-3 py-2 outline-none text-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-[#0067d5] text-white px-5 py-2 text-sm font-bold">Search</button>
                    </div>

                    <div className="relative group self-end md:self-auto">
                        <button className="flex items-center gap-2 border border-[#0067d5] text-[#0067d5] px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition">
                            <Download size={16} /> Export <ChevronDown size={14} />
                        </button>
                        {/* Export Dropdown */}
                        <div className="absolute right-0 mt-1 w-32 bg-white shadow-xl border rounded-lg hidden group-hover:block z-10">
                            <button onClick={exportPDF} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b">PDF File</button>
                            <button onClick={exportExcel} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Excel File</button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#f8f9fb] text-[#334257] text-xs font-black uppercase border-b">
                                <th className="px-6 py-4">SL</th>
                                <th className="px-6 py-4">Brand Logo</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4 text-center">Total Product</th>
                                <th className="px-6 py-4 text-center">Total Order</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())).map((brand, index) => (
                                <tr key={brand._id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 text-gray-500 font-medium">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 rounded-lg border flex items-center justify-center bg-white p-1">
                                            <img src={brand.image} alt="" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#334257]">{brand.name}</td>
                                    <td className="px-6 py-4 text-center text-gray-600">{brand.totalProducts || 0}</td>
                                    <td className="px-6 py-4 text-center text-gray-600">{brand.totalOrders || 0}</td>
                                    <td className="px-6 py-4 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={brand.status} className="sr-only peer" onChange={() => handleStatusToggle(brand._id, brand.status)} />
                                            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#0067d5] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleEditClick(brand)} className="p-1.5 text-[#00b3c5] border border-[#00b3c5] rounded-lg hover:bg-[#00b3c5] hover:text-white transition shadow-sm"><Edit size={16} /></button>
                                            <button onClick={() => deleteBrand(brand._id)} className="p-1.5 text-red-400 border border-red-100 rounded-lg hover:bg-red-500 hover:text-white transition shadow-sm"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}