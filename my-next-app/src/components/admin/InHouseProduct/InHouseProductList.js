"use client";

import { BASE_URL } from "@/utils/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaDownload, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";


export default function InHouseProductList() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Dynamic Lists
    const [categories, setCategories] = useState([]); // Level 1
    const [subCategories, setSubCategories] = useState([]); // Level 2
    const [subSubCategories, setSubSubCategories] = useState([]); // Level 3
    const [brands, setBrands] = useState([]);

    const [editFormData, setEditFormData] = useState({
        id: "",
        name: "",
        unitPrice: "",
        currentStock: ""
    });

    const [filters, setFilters] = useState({
        brand: "",
        category: "",
        subCategory: "",
        subSubCategory: ""
    });

    // 1. Initial Fetch: Brands aur Main Categories (Level 1)
    useEffect(() => {

        const fetchMetadata = async () => {

            try {

                const [catRes, brandRes] = await Promise.all([
                    fetch(`${BASE_URL}/category`, { credentials: "include" }),
                    fetch(`${BASE_URL}/brand`, { credentials: "include" })
                ]);
                const catData = await catRes.json();
                const brandData = await brandRes.json();

                // Sirf Level 1 categories filter karein agar backend saara data bhej raha hai
                setCategories(catData.filter(c => !c.parent || c.level === 1));
                setBrands(brandData || []);
            } catch (err) {
                console.error("Metadata fetch error:", err);
            }
        };
        fetchMetadata();
    }, []);

    // 2. Fetch Products based on Page/Filters
    const fetchProducts = async () => {
        setLoading(true);

        const query = new URLSearchParams({
            page,
            search,
            brand: filters.brand,
            category: filters.category,
            subCategory: filters.subCategory,
            subSubCategory: filters.subSubCategory
        }).toString();

        try {
            const res = await fetch(`${BASE_URL}/Adminproducts?${query}`, {
                credentials: "include"
            });
            const data = await res.json();
            setProducts(data.products || []);
            setTotalPages(data.totalPages || 1);
            setTotalCount(data.totalProducts || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, [page]);

    // HANDLERS
    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setFilters({ ...filters, category: categoryId, subCategory: "", subSubCategory: "" });
        setSubSubCategories([]);

        if (!categoryId) return setSubCategories([]);

        try {
            const res = await fetch(`${BASE_URL}/category?parent=${categoryId}`, {
                credentials: "include"
            });
            setSubCategories(await res.json());
        } catch (err) { console.error(err); }
    };

    const handleSubCategoryChange = async (e) => {
        const subId = e.target.value;
        setFilters({ ...filters, subCategory: subId, subSubCategory: "" });

        if (!subId) return setSubSubCategories([]);

        try {
            const res = await fetch(`${BASE_URL}/category?parent=${subId}`, {
                credentials: "include"
            });
            setSubSubCategories(await res.json());
        } catch (err) { console.error(err); }
    };

    const handleReset = () => {
        setFilters({ brand: "", category: "", subCategory: "", subSubCategory: "" });
        setSearch("");
        setSubCategories([]);
        setSubSubCategories([]);
        setPage(1);
        setTimeout(() => fetchProducts(), 0);
    };

    const handleToggleStatus = async (id, field) => {
        try {
            await fetch(`${BASE_URL}/Adminproducts/toggle-status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id, field })
            });
            if (res.ok) {
                setProducts(products.map(p => p._id === id ? { ...p, [field]: !p[field] } : p));
            }
        } catch (err) { console.error(err); }
    };

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // --- Edit Function (Modal Open karne ke liye) ---
    const handleEdit = (product) => {
        setEditFormData({
            id: product._id,
            name: product.name,
            unitPrice: product.unitPrice,
            currentStock: product.currentStock || 0
        });
        setIsEditModalOpen(true);
    };

    // --- Update API Call (Backend ko data bhejne ke liye) ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/Adminproducts/${editFormData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(editFormData)
            });

            if (res.ok) {
                // Local state (Table) ko update karein bina refresh kiye
                setProducts(products.map(p => p._id === editFormData.id ? { ...p, ...editFormData } : p));
                setIsEditModalOpen(false);
                alert("Product updated successfully!");
            }
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    // --- Delete Function (Updated) ---
    const handleDelete = async (id) => {

        if (window.confirm("Are you sure you want to delete this product?")) {

            try {

                const res = await fetch(`${BASE_URL}/Adminproducts/${id}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                if (res.ok) {
                    // Table se turant hatane ke liye
                    setProducts(products.filter(p => p._id !== id));
                    setTotalCount(prev => prev - 1);
                    alert("Product deleted successfully!");
                }
            } catch (err) {
                console.error("Delete error:", err);
            }
        }
    };

    return (
        <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen text-gray-700">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <h1 className="text-xl font-bold">In House Product List</h1>
                <span className="bg-gray-200 px-2 py-0.5 rounded-full text-xs font-bold">{totalCount}</span>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
                <h2 className="font-bold mb-4">Filter Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Brand</label>
                        <select className="w-full border rounded p-2 text-sm bg-gray-50" value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })}>
                            <option value="">All Brands</option>
                            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                        <select className="w-full border rounded p-2 text-sm bg-gray-50" value={filters.category} onChange={handleCategoryChange}>
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Sub Category</label>
                        <select className="w-full border rounded p-2 text-sm bg-gray-50" value={filters.subCategory} onChange={handleSubCategoryChange}>
                            <option value="">Select Sub Category</option>
                            {subCategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Sub Sub Category</label>
                        <select className="w-full border rounded p-2 text-sm bg-gray-50" value={filters.subSubCategory} onChange={(e) => setFilters({ ...filters, subSubCategory: e.target.value })}>
                            <option value="">Select Sub Sub Category</option>
                            {subSubCategories.map(ss => <option key={ss._id} value={ss._id}>{ss.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={handleReset} className="px-6 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200">Reset</button>
                    <button onClick={() => { setPage(1); fetchProducts(); }} className="px-6 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">Show data</button>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex border rounded overflow-hidden w-full md:w-96">
                        <input type="text" placeholder="Search product..." className="flex-1 px-4 py-2 text-sm outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button onClick={() => { setPage(1); fetchProducts(); }} className="bg-blue-500 text-white px-4">Search</button>
                    </div>
                    <div className="flex gap-2">
                        <button className="border px-4 py-2 rounded text-sm flex items-center gap-2"><FaDownload /> Export</button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm flex items-center gap-2" ><FaPlus /> Add Product</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-y text-gray-600">
                            <tr>
                                <th className="px-4 py-3">SL</th>
                                <th className="px-4 py-3">Product Image</th>
                                <th className="px-4 py-3">Product Name</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3 text-center">Featured</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.map((product, index) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">{(page - 1) * 10 + (index + 1)}</td>
                                    {/* 2. Product Image - YAHAN HAI IMAGE CODE */}
                                    <td className="px-3 py-4">
                                        <div className="flex items-center">
                                            <img
                                                src={ product.thumbnail ? `${BASE_URL}/uploads/${product.thumbnail.split(/[\\/]/).pop()}` : "/default.png"}
                                                alt={product.name}
                                                className="w-10 h-10 rounded shadow-sm border object-cover"
                                                onError={(e) => { console.log("Broken Image URL:", e.target.src); e.target.src = "https://via.placeholder.com/50?text=No+Img"; }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-medium">{product.name}</td>
                                    <td className="px-4 py-4">₹ {product.unitPrice}</td>
                                    <td className="px-4 py-4 text-center">
                                        <input type="checkbox" checked={product.isFeatured} onChange={() => handleToggleStatus(product._id, 'isFeatured')} />
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <input type="checkbox" checked={product.isActive} onChange={() => handleToggleStatus(product._id, 'isActive')} />
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="flex justify-center gap-2 text-gray-400">
                                            {/* VIEW */}
                                            <FaEye
                                                className="hover:text-blue-500 cursor-pointer"
                                                onClick={() => handleViewProduct(product)}
                                                title="View Details"
                                            />

                                            {/* EDIT */}
                                            <FaEdit
                                                className="hover:text-green-500 cursor-pointer"
                                                onClick={() => handleEdit(product)}
                                                title="Edit Product"
                                            />

                                            {/* DELETE */}
                                            <FaTrash
                                                className="hover:text-red-500 cursor-pointer"
                                                onClick={() => handleDelete(product._id)}
                                                title="Delete Product"
                                            />

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t flex justify-end">
                    <div className="flex gap-1">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">‹</button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-blue-500 text-white' : ''}`}>{i + 1}</button>
                        ))}
                        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">›</button>
                    </div>
                </div>
            </div>
            {/* --- VIEW PRODUCT MODAL --- */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <h2 className="text-xl font-bold text-gray-800">Product Info</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-3xl font-light">&times;</button>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Image Section */}
                            <div className="bg-gray-100 rounded-xl overflow-hidden border flex items-center justify-center aspect-square">
                                <img
                                    src={selectedProduct.thumbnail ? `${BASE_URL}/uploads/${selectedProduct.thumbnail.split(/[\\/]/).pop()}` : "https://via.placeholder.com/300" }
                                    alt={selectedProduct.name}
                                    className="object-contain w-full h-full p-2"
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found"; }}
                                />
                            </div>

                            {/* Info Section */}
                            <div className="space-y-4 min-w-0 overflow-hidden">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h3>
                                    <p className="text-blue-500 font-medium">{selectedProduct.category?.name || "No Category"}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-xs text-blue-600 font-bold uppercase">Price</p>
                                        <p className="text-lg font-bold text-blue-900">₹{selectedProduct.unitPrice}</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-xs text-green-600 font-bold uppercase">Stock</p>
                                        <p className="text-lg font-bold text-green-900">{selectedProduct.currentStock || 0} pcs</p>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Description</p>
                                    <div
                                        className="text-sm text-gray-600 leading-relaxed break-words whitespace-normal"
                                        style={{ wordWrap: 'break-word' }}
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                selectedProduct.description ||
                                                "<p>No description provided for this product.</p>"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t flex justify-end rounded-b-2xl">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-8 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-black transition-all font-semibold"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EDIT PRODUCT MODAL --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Edit Product</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-2xl">&times;</button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Product Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
                                        value={editFormData.unitPrice}
                                        onChange={(e) => setEditFormData({ ...editFormData, unitPrice: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Stock</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
                                        value={editFormData.currentStock}
                                        onChange={(e) => setEditFormData({ ...editFormData, currentStock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}