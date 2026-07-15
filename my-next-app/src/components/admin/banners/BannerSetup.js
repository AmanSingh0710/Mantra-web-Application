"use client";
import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaPlus, FaPencilAlt, FaTrash, FaQuestionCircle, FaFlag } from "react-icons/fa";
import { fetchFromAPI } from "@/utils/api";

export default function BannerPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [image, setImage] = useState(null);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        bannerType: "Main Banner",
        link: "",
        published: true
    });
    const [filters, setFilters] = useState({
        search: "",
        bannerType: "",
        status: ""
    });

    // 1. Fetch Banners
    const fetchBanners = async () => {
        try {
            setLoading(true);

            const queryString = new URLSearchParams(filters).toString();

            const data = await fetchFromAPI(`/banner?${queryString}`);

            if (Array.isArray(data)) {
                setBanners(data);
            } else if (Array.isArray(data.banners)) {
                setBanners(data.banners);
            } else {
                console.error("Unexpected response:", data);
                setBanners([]);
            }

        } catch (err) {
            console.error("Fetch Error:", err);
            setBanners([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    // 2. Toggle Status
    const toggleStatus = async (id) => {
        try {
            const data = await fetchFromAPI(`/banner/toggle/${id}`, {
                method: "PATCH"
            });

            setBanners(prev =>
                prev.map(b => (b._id === id ? data : b))
            );

        } catch (err) {
            console.error("Toggle Failed:", err);
        }
    };

    // 3. Delete Banner
    const deleteBanner = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;

        try {
            await fetchFromAPI(`/banner/${id}`, {
                method: "DELETE"
            });

            setBanners(prev => prev.filter(b => b._id !== id));

        } catch (err) {
            console.error("Delete Failed:", err);
        }
    };

    // 4. Submit Form (Create/Update)
    const handleSubmit = async () => {
        if (!image && !editId) {
            alert("Please select an image");
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append("bannerType", formData.bannerType);
            submitData.append("link", formData.link);
            submitData.append("published", formData.published);
            if (image) submitData.append("image", image);

            if (editId) {
                await fetchFromAPI(`/banner/${editId}`, {
                    method: "PUT",
                    body: submitData
                });
            } else {
                await fetchFromAPI(`/banner`, {
                    method: "POST",
                    body: submitData
                });
            }

            // Reset
            setFormData({
                bannerType: "Main Banner",
                link: "",
                published: true
            });

            setImage(null);
            setEditId(null);
            setShowForm(false);

            fetchBanners();

        } catch (err) {
            console.error("Submit Error:", err);
            alert("Something went wrong");
        }
    };

    const handleEdit = (banner) => {
        setFormData({
            bannerType: banner.bannerType,
            link: banner.link || "",
            published: banner.published
        });

        setEditId(banner._id);
        setShowForm(true);
    };


    return (
        <div className="animate-in fade-in duration-500 text-black p-4 md:p-6 bg-[#fdfdfd]">
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 border border-gray-100">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#334257] flex items-center gap-2">
                        <FaFlag className="text-pink-500" /> Banner Setup
                        <span className="text-blue-500 text-xs font-normal bg-blue-50 px-2 py-1 rounded">(Default)</span>
                    </h2>
                    <FaQuestionCircle className="text-gray-300 cursor-pointer hover:text-gray-500" size={20} />
                </div>

                {/* Filters Section (Customer Review style) */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 bg-[#f8f9fb] p-4 rounded-xl items-end">

                    {/* Search Bar */}
                    <div className="lg:col-span-2 relative">
                        <div className="flex bg-white border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-blue-500">
                            <input
                                type="text"
                                placeholder="Search by Banner Type..."
                                className="w-full pl-4 py-2 outline-none text-sm"
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                            <button className="bg-[#0082cc] text-white px-4 py-2">
                                <FaSearch size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Type Filter */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">Banner Type</label>
                        <select
                            className="border rounded-lg p-2 text-sm outline-none bg-white cursor-pointer"
                            onChange={(e) => setFilters({ ...filters, bannerType: e.target.value })}
                        >
                            <option value="">All Types</option>
                            <option value="Main Banner">Main Banner</option>
                            <option value="Footer Banner">Footer Banner</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex flex-col gap-1 ">
                        <label className="text-xs font-semibold text-gray-600">Status</label>
                        <select
                            className="border rounded-lg p-2 text-sm outline-none bg-white cursor-pointer"
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">All Status</option>
                            <option value="true">Published</option>
                            <option value="false">Unpublished</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button onClick={fetchBanners} className="bg-[#0082cc] text-white flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer">
                            <FaFilter size={12} /> Filter
                        </button>
                        <button onClick={() => setShowForm(true)} className="bg-[#0082cc] text-white flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer">
                            <FaPlus size={12} /> Add
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-[#334257]">Banner Table</span>
                    <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">{banners.length}</span>
                </div>

                <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f8f9fb]">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">SL</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Banner Image</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Banner Type</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Published</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">Loading banners...</td></tr>
                            ) : banners.length === 0 ? (
                                <tr><td colSpan="5" className="p-10 text-center text-gray-400">No banners found</td></tr>
                            ) : (
                                banners.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-600">{index + 1}</td>
                                        <td className="p-4">
                                            <div className="w-28 h-10 rounded-md overflow-hidden border border-gray-100">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image}`}
                                                    className="w-full h-full object-cover"
                                                    alt="banner"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-gray-700">{item.bannerType}</td>
                                        <td className="p-4 text-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={item.published}
                                                    onChange={() => toggleStatus(item._id)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#0082cc] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                            </label>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleEdit(item)} className="p-2 border border-blue-200 text-blue-500 rounded hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                                                    <FaPencilAlt size={12} />
                                                </button>
                                                <button
                                                    onClick={() => deleteBanner(item._id)}
                                                    className="p-2 border border-red-200 text-red-500 rounded hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold mb-6 text-[#334257]">
                        Banner Form
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* LEFT SIDE */}
                        <div className="space-y-5">

                            {/* Banner Type */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Banner Type</label>
                                <select
                                    className="w-full border p-2 rounded-lg"
                                    value={formData.bannerType}
                                    onChange={(e) => setFormData({ ...formData, bannerType: e.target.value })}
                                >
                                    <option value="Main Banner">Main Banner</option>
                                    <option value="Footer Banner">Footer Banner</option>
                                </select>
                            </div>

                            {/* URL */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Banner URL</label>
                                <input
                                    type="text"
                                    placeholder="Enter url"
                                    className="w-full border p-2 rounded-lg"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>

                            {/* Published */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                />
                                <label className="text-sm font-semibold">Published</label>
                            </div>

                        </div>

                        {/* RIGHT SIDE - Upload */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Banner Image</label>
                            <div className="border-2 border-dashed border-blue-400 rounded-lg p-10 text-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="hidden"
                                    id="upload"
                                />
                                <label htmlFor="upload" className="cursor-pointer text-blue-600">
                                    Drag and drop file or Browse file
                                </label>
                            </div>
                            <p className="text-sm text-gray-500 mt-3">
                                Banner Image Ratio 3:1
                            </p>
                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setShowForm(false)}
                            className="px-5 py-2 bg-gray-200 rounded-lg"
                        >
                            Reset
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-5 py-2 bg-[#0082cc] text-white rounded-lg"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}