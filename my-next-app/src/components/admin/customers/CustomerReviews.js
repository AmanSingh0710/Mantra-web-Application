"use client";
import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaFileDownload, FaStar } from "react-icons/fa";
import * as XLSX from "xlsx";
import { fetchFromAPI } from "@/utils/api"; 

export default function CustomerReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productList, setProductList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [filters, setFilters] = useState({
        search: "", productId: "", customerId: "", status: "", from: "", to: ""
    });

    // ✅ 1. FETCH REVIEWS
    const fetchReviews = async () => {
        try {
            setLoading(true);

            const queryString = new URLSearchParams(filters).toString();

            const data = await fetchFromAPI(`/review/admin/all?${queryString}`);

            setReviews(Array.isArray(data) ? data : []);

        } catch (err) {
            console.log("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ 2. FETCH DROPDOWNS
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [prodData, custData] = await Promise.all([
                    fetchFromAPI("/review/dropdown-products"),
                    fetchFromAPI("/review/dropdown-customers"),
                ]);

                setProductList(Array.isArray(prodData) ? prodData : []);
                setCustomerList(Array.isArray(custData) ? custData : []);

            } catch (error) {
                console.error("Fetch Dropdown Error:", error);
                setProductList([]);
                setCustomerList([]);
            }
        };

        fetchDropdownData();
    }, []);

    // ✅ 3. INITIAL FETCH
    useEffect(() => {
        fetchReviews();
    }, []);

    // ✅ EXPORT
    const handleExport = () => {
        const data = reviews.map((r, i) => ({
            SL: i + 1,
            Product: r.productId?.name,
            Customer: r.customerId?.name,
            Rating: r.rating,
            Review: r.comment,
            Date: new Date(r.createdAt).toLocaleDateString(),
            Status: r.status
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Reviews");
        XLSX.writeFile(wb, "Customer_Reviews.xlsx");
    };

    return (
        <div className="animate-in fade-in duration-500 text-black ">
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-[#334257] mb-6 flex items-center gap-2">
                    ⭐ Customer Reviews <span className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-500">{reviews.length}</span>
                </h2>

                {/* Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 bg-[#f8f9fb] p-4 rounded-xl items-end">

                    {/* Search Bar (No label as per screenshot) */}
                    <div className="lg:col-span-2 relative">
                        <div className="flex bg-white border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-blue-500">
                            <input
                                type="text"
                                placeholder="Search by Product or Customer"
                                className="w-full pl-4 py-2 outline-none text-sm"
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                            <button className="bg-[#0082cc] text-white px-4 py-2">
                                <FaSearch size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Product Dropdown */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">Products</label>
                        <select className="border rounded-lg p-2 text-sm outline-none bg-white" onChange={(e) => setFilters({ ...filters, productId: e.target.value })}>
                            <option value="">Select Product</option>
                            {productList?.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Customer Dropdown */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">Customer</label>
                        <select className="border rounded-lg p-2 text-sm outline-none bg-white" onChange={(e) => setFilters({ ...filters, customerId: e.target.value })}>
                            <option value="">All customer</option>
                            {customerList?.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">Choose Status</label>
                        <select className="border rounded-lg p-2 text-sm outline-none bg-white" onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                            <option value="">---Select status---</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Date From */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">From</label>
                        <input
                            type="date"
                            className="border rounded-lg p-2 text-sm outline-none bg-white"
                            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                        />
                    </div>

                    {/* Date To */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">To</label>
                        <input
                            type="date"
                            className="border rounded-lg p-2 text-sm outline-none bg-white"
                            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                        />
                    </div>
                </div>

                {/* Action Buttons Section */}
                <div className="flex justify-end gap-3 mb-6">
                    <button onClick={fetchReviews} className="bg-[#0082cc] text-white px-8 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-blue-700 transition-all">
                        <FaFilter size={12} /> Filter
                    </button>
                    <div className="relative group">
                        <button onClick={handleExport} className="border border-[#0082cc] text-[#0082cc] px-8 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-blue-50 transition-all">
                            <FaFileDownload size={12} /> Export <span className="text-[10px]">▼</span>
                        </button>
                    </div>
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f8f9fb]">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">SL</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Rating</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Review</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="7" className="p-10 text-center text-gray-400 italic">Fetching data...</td></tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-10 text-center">
                                        <img src="/no-data.png" className="w-32 mx-auto mb-4 opacity-50" alt="No reviews" />
                                        <p className="text-gray-400">No review found</p>
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-600">{index + 1}</td>
                                        <td className="p-4 text-sm font-bold text-blue-600">{item.productId?.name}</td>
                                        <td className="p-4 text-sm text-gray-700">{item.customerId?.name}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-1 text-orange-400">
                                                <FaStar /> <span className="text-gray-700 font-bold">{item.rating}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{item.comment}</td>
                                        <td className="p-4 text-sm text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}