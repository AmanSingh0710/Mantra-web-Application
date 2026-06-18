//src/components/admin/Notification/NotificationPge.js
"use client";

import { BASE_URL } from "@/utils/api";
import { useState, useEffect } from "react";
import { FaBell, FaSearch, FaTrash, FaPaperPlane, FaRedo, FaImage } from "react-icons/fa";
import toast from "react-hot-toast";

export default function NotificationPage() {
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: null
    });

    // 1. Fetch Notifications from Backend
    useEffect(() => {
        // ✅ Fetch Notifications
        const fetchNotifications = async () => {
            try {
                setLoading(true);

                const res = await fetch(`${BASE_URL}/notifications/admin/list`, {
                    credentials: "include"
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                const list =
                    Array.isArray(data)
                        ? data
                        : Array.isArray(data.data)
                            ? data.data
                            : Array.isArray(data.notifications)
                                ? data.notifications
                                : [];

                setNotifications(list);
                setFilteredNotifications(list);
            } catch (err) {
                toast.error("Failed to load notifications");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const handleSend = async () => {
        try {
            if (!formData.title || !formData.description) {
                toast.error("Title & Description required");
                return;
            }

            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            if (formData.image) data.append("image", formData.image);

            const res = await fetch(`${BASE_URL}/notifications/send`, {
                method: "POST",
                credentials: "include",
                body: data
            });

            if (!res.ok) throw new Error();

            toast.success("Notification Sent ✅");
            handleReset();
            fetchNotifications();
        } catch {
            toast.error("Send failed ❌");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this notification?")) return;

        try {
            const res = await fetch(`${BASE_URL}/notifications/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (res.ok) {
                setNotifications(prev => prev.filter(n => n._id !== id));
                toast.success("Deleted");
            }
        } catch {
            toast.error("Delete failed");
        }
    };

    // ✅ Resend
    const handleResend = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/notifications/resend/${id}`, {
                method: "POST",
                credentials: "include"
            });

            if (res.ok) toast.success("Resent Successfully");
        } catch {
            toast.error("Resend failed");
        }
    };

    const handleReset = () => {
        setFormData({ title: "", description: "", image: null });
        setImagePreview(null);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8 text-slate-700">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* --- TOP SECTION: SEND NOTIFICATION FORM --- */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 border-b border-slate-50 flex items-center gap-2 font-bold text-[#334257]">
                        <FaBell className="text-blue-500" /> Send Notification
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Side: Inputs */}
                        <div className="lg:col-span-2 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">Title</label>
                                <input
                                    type="text"
                                    placeholder="New notification"
                                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">Description</label>
                                <textarea
                                    rows="4"
                                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Right Side: Image Upload */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-48 h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <FaImage className="text-slate-300 text-5xl" />
                                )}
                            </div>
                            <div className="w-full">
                                <label className="block text-xs font-semibold text-cyan-500 mb-1">Image (Ratio 1:1)</label>
                                <div className="flex border border-slate-200 rounded-lg overflow-hidden text-sm">
                                    <input
                                        type="file"
                                        id="notif-img"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <div className="flex-1 p-2 bg-white text-slate-400 truncate">
                                        {formData.image ? formData.image.name : "Choose File"}
                                    </div>
                                    <label htmlFor="notif-img" className="bg-slate-50 px-4 py-2 border-l border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors font-medium">
                                        Browse
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="p-4 bg-slate-50/50 flex justify-end gap-3">
                        <button
                            onClick={handleReset}
                            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition-all"
                        >
                            Reset
                        </button >
                        <button onClick={handleSend} className="px-6 py-2 bg-[#0082cc] hover:bg-blue-700 text-white rounded-lg font-medium shadow-md shadow-blue-100 transition-all flex items-center gap-2">
                            Send Notification
                        </button>
                    </div>
                </div>

                {/* --- BOTTOM SECTION: DATA TABLE --- */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-[#334257]">Push Notification Table</span>
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                {notifications.length}
                            </span>
                        </div>

                        {/* Search Bar */}
                        <div className="flex w-full md:w-auto border border-slate-200 rounded-lg overflow-hidden">
                            <div className="flex items-center px-3 bg-white text-slate-400">
                                <FaSearch size={14} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by title"
                                className="p-2 outline-none text-sm w-full md:w-64"
                            />
                            <button className="bg-[#0082cc] text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-all">
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#F8F9FB] text-slate-500 text-xs font-bold uppercase">
                                <tr>
                                    <th className="p-4">SL</th>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Image</th>
                                    <th className="p-4 text-center">Notification Count</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center">Resend</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {loading ? (
                                    <tr><td colSpan="8" className="p-10 text-center text-slate-400">Loading...</td></tr>
                                ) : notifications.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="p-20 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-40">
                                                <div className="bg-slate-100 p-6 rounded-full mb-4">
                                                    <FaBell size={40} className="text-slate-400" />
                                                </div>
                                                <p className="font-medium">No data found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    notifications.map((item, index) => (
                                        <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4">{index + 1}</td>
                                            <td className="p-4 font-medium">{item.title}</td>
                                            <td className="p-4 text-slate-500 max-w-xs truncate">{item.description}</td>
                                            <td className="p-4">
                                                <div className="w-10 h-10 rounded border border-slate-100 overflow-hidden bg-slate-50">
                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">{item.count || 0}</td>
                                            <td className="p-4 text-center">
                                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-[10px] font-bold">SENT</span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button className="text-blue-500 hover:text-blue-700"><FaRedo size={14} /></button>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button className="text-red-400 hover:text-red-600"><FaTrash size={14} /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}