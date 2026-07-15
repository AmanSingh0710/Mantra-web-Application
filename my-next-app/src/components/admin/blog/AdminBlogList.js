"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import AdminAddBlog from "./AdminAddBlog";
//src/components/admin/blog/AdminBlogList.js
export default function AdminBlogList() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingBlog, setEditingBlog] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        author: "",
        status: "active",
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const getBlogs = async () => {
            try {
                const response = await fetchFromAPI("/blogs/admin");
                if (response?.success) {
                    setBlogs(response.blogs || []);
                }
            } catch (error) {
                console.error("Error fetching admin blog list:", error);
            } finally {
                setLoading(false);
            }
        };
        getBlogs();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const payload = {
                title: formData.title,
                description: formData.description,
                content: formData.content,
                author: formData.author,
                status: formData.status,
            };

            const data = await fetchFromAPI(`/blogs/admin/${editingBlog._id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(payload),
                }
            );

            if (data.success) {
                setBlogs((prev) =>
                    prev.map((blog) =>
                        blog._id === editingBlog._id
                            ? data.blog
                            : blog
                    )
                );

                setEditingBlog(null);

                toast.success("Blog updated successfully");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this blog?")) return;

        try {
            const data = await fetchFromAPI(`/blogs/admin/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (data.success) {
                setBlogs((prev) =>
                    prev.filter((blog) => blog._id !== id)
                );
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const filteredBlogs = blogs.filter((blog) =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (showAddForm) {
        return (
            <AdminAddBlog
                onBack={() => setShowAddForm(false)}
            />
        );
    }

    return (

        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans antialiased">

            {/* Top Navbar Hub */}
            <header className="bg-slate-900 text-white px-4 py-3 shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <span className="text-amber-500 font-bold text-lg tracking-wider">RETAIL HUB</span>
                    <span className="text-gray-300 text-sm hidden sm:inline">|</span>
                    <h1 className="text-sm md:text-base font-medium text-gray-200">Blog Content Dashboard</h1>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-4 py-1.5 rounded text-xs md:text-sm shadow transition-colors"
                >
                    + Add New Article
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
                {/* Quick Insights Cards (Amazon Style overview metrics) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded p-4 shadow-sm">
                        <p className="text-xs font-bold text-gray-500 uppercase">Total Articles</p>
                        <p className="text-xl md:text-2xl font-semibold mt-1">{blogs.length}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded p-4 shadow-sm">
                        <p className="text-xs font-bold text-gray-500 uppercase">Status</p>
                        <p className="text-xl md:text-2xl font-semibold mt-1 text-green-600">Active</p>
                    </div>
                </div>

                {editingBlog && (
                    <div className="bg-white p-5 rounded border mb-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Edit Blog
                        </h2>

                        <form onSubmit={handleUpdate} className="space-y-4">

                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                className="w-full border p-2 rounded"
                            />

                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                className="w-full border p-2 rounded"
                            />

                            <textarea
                                rows={8}
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        content: e.target.value,
                                    })
                                }
                                className="w-full border p-2 rounded"
                            />

                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.value,
                                    })
                                }
                                className="border p-2 rounded"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    {submitting
                                        ? "Updating..."
                                        : "Update Blog"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setEditingBlog(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search Control Box */}
                <div className="bg-white border border-gray-200 rounded p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="relative flex-grow max-w-md">
                        <input
                            type="text"
                            placeholder="Search by article title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                    </div>
                    <div className="text-xs text-gray-500 self-center">
                        Showing {filteredBlogs.length} of {blogs.length} entries
                    </div>
                </div>

                {/* Dynamic Data Content Area */}
                {loading ? (
                    <div className="bg-white border border-gray-200 rounded p-12 text-center shadow-sm">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-2"></div>
                        <p className="text-sm text-gray-500">Loading your content repository...</p>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded p-12 text-center shadow-sm">
                        <p className="text-gray-500 text-sm">No articles matched your search criteria.</p>
                    </div>
                ) : (
                    /* Responsive Table Wrap */
                    <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        <th className="px-4 py-3 md:px-6">Article Details</th>
                                        <th className="px-4 py-3 md:px-6 hidden md:table-cell">Slug Handle</th>
                                        <th className="px-4 py-3 md:px-6">Status</th>
                                        <th className="px-4 py-3 md:px-6 text-right">Actions</th>

                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 text-xs md:text-sm">
                                    {filteredBlogs.map((blog) => (
                                        <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                                            {/* Title Information */}
                                            <td className="px-4 py-4 md:px-6">
                                                <div className="font-semibold text-gray-900 max-w-xs md:max-w-md truncate">
                                                    {blog.title}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5 md:hidden">
                                                    Slug: {blog.slug}
                                                </div>
                                            </td>
                                            {/* Slug Info (Desktop Only) */}
                                            <td className="px-4 py-4 md:px-6 hidden md:table-cell text-gray-600 font-mono text-xs">
                                                {blog.slug}
                                            </td>

                                            <td>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${blog.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {blog.status}
                                                </span>
                                            </td>
                                            {/* Action Matrix */}
                                            <td className="px-4 py-4 md:px-6 text-right whitespace-nowrap">
                                                <div className="inline-flex space-x-3">
                                                    <Link
                                                        href={`/blogs/${blog.slug}`}
                                                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                                    >
                                                        View
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setEditingBlog(blog);

                                                            setFormData({
                                                                title: blog.title || "",
                                                                description: blog.description || "",
                                                                content: blog.content || "",
                                                                author: blog.author || "",
                                                                status: blog.status || "active",
                                                            });

                                                            window.scrollTo({
                                                                top: 0,
                                                                behavior: "smooth",
                                                            });
                                                        }}
                                                        className="text-amber-600 hover:text-amber-800"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(blog._id)}
                                                        className="text-red-600 hover:text-red-800 hover:underline font-medium focus:outline-none"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}