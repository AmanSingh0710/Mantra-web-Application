"use client";
//src/components/admin/blog/AdminAddBlog.js
import Link from "next/link";
import { useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import toast from "react-hot-toast";

export default function AdminAddBlog() {

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        author: "Admin",
        status: "active"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,

        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            const payload = new FormData();

            payload.append("title", formData.title);
            payload.append("description", formData.description);
            payload.append("content", formData.content);
            payload.append("author", formData.author);
            payload.append("status", formData.status);

            if (image) {
                payload.append("image", image);
            }

            const data = await fetchFromAPI("/blogs/admin/add",
                {
                    method: "POST",
                    body: payload,
                }
            );

            toast.success(data?.message || "Blog created successfully");

            setFormData({
                title: "",
                description: "",
                content: "",
                author: "Admin",
                status: "active",
            });

            setImage(null);
            setPreview("");

        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans antialiased">
            {/* Top Navbar Hub */}
            <header className="bg-slate-900 text-white px-4 py-3 shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <span className="text-amber-500 font-bold text-lg tracking-wider">RETAIL HUB</span>
                    <span className="text-gray-300 text-sm hidden sm:inline">|</span>
                    <h1 className="text-sm md:text-base font-medium text-gray-200">Catalog New Listing</h1>
                </div>
                <Link
                    href="/admin/blog"
                    className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors"
                >
                    ← Cancel & Go Back
                </Link>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    {/* Header Title section */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h2 className="text-sm md:text-base font-bold text-gray-700">Article Details & Specifications</h2>
                    </div>

                    {/* Form Node */}
                    <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5 text-sm">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-medium">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Input Element: Title */}
                        <div className="space-y-1">
                            <label className="block font-bold text-gray-700" htmlFor="title">
                                Article Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                placeholder="e.g., Top 10 Tech Accessories to Buy This Summer"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            />
                        </div>

                        {/* Input Element: Image Link */}
                        <div className="space-y-1">
                            <label className="block font-bold text-gray-700" htmlFor="image">
                                Featured Cover Image URL
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    if (!file) return;

                                    setImage(file);
                                    setPreview(URL.createObjectURL(file));
                                }}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-40 h-40 object-cover rounded border"
                                />
                            )}
                        </div>

                        {/* Input Element: Description */}
                        <div className="space-y-1">
                            <label className="block font-bold text-gray-700" htmlFor="description">
                                Body Copy Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows={6}
                                placeholder="Draft deep promotional outlines, item highlights or stories here..."
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-y"
                            ></textarea>
                        </div>

                        <div className="space-y-1">
                            <label className="block font-bold">
                                Blog Content *
                            </label>

                            <textarea
                                rows={12}
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Write complete blog content..."
                                className="w-full p-3 border rounded"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block font-bold">
                                Author
                            </label>

                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block font-bold">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>
                        </div>

                        {/* Form Actions Footer Box */}
                        <div className="pt-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                            <Link
                                href="/admin/blog"
                                className="px-4 py-2 border border-gray-300 rounded text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-slate-900 font-bold rounded text-xs md:text-sm shadow transition-colors focus:outline-none"
                            >
                                {submitting ? "Publishing Index..." : "Publish Article"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}