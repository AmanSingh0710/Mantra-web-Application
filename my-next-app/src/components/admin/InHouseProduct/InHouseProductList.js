"use client";

import { fetchFromAPI , getImageUrl } from "@/utils/api";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    FaSearch, FaDownload, FaPlus, FaEye, FaEdit, FaTrash,
    FaFilter, FaBoxOpen, FaLayerGroup, FaTag, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";

export default function InHouseProductList() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Filter Metadata States
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subSubCategories, setSubSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // Production Form State (Aligned exactly with your Mongoose Schema)
    const [editFormData, setEditFormData] = useState({
        id: "",
        productName: "",
        price: "",
        stock: "",
        status: "ACTIVE",
        listingType: "BESTSELLER"
    });

    const [filters, setFilters] = useState({
        brand: "",
        category: "",
        subCategory: "",
        subSubCategory: ""
    });

    // 1. Fetching Global Metadata
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    fetchFromAPI(`/categories`, { credentials: "include" }),
                    fetchFromAPI(`/brand`, { credentials: "include" })
                ]);
                const catResult = await catRes.json();
                const brandResult = await brandRes.json();

                const cats = catResult.data || [];
                setCategories(cats.filter(c => !c.parent || c.level === 1));
                setBrands(brandResult.data || brandResult || []);
            } catch (err) {
                console.error("Metadata fetch error:", err);
            }
        };
        fetchMetadata();
    }, []);

    // 2. Optimized & Memoized Product Fetch Strategy
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const query = new URLSearchParams({
            page: page.toString(),
            search,
            brand: filters.brand,
            category: filters.category,
            subCategory: filters.subCategory,
            subSubCategory: filters.subSubCategory
        }).toString();

        try {
            const data = await fetchFromAPI(`/Adminproducts?${query}`, {
                credentials: "include"
            });
            setProducts(data.products || []);
            setTotalPages(data.totalPages || 1);
            setTotalCount(data.totalProducts || 0);
        } catch (err) {
            console.error("Product fetching pipeline failure:", err);
        } finally {
            setLoading(false);
        }
    }, [page, search, filters]);

    useEffect(() => {
        fetchProducts();
    }, [page, fetchProducts]);

    // Relational Dependent Cascades
    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setFilters({ ...filters, category: categoryId, subCategory: "", subSubCategory: "" });
        setSubSubCategories([]);

        if (!categoryId) return setSubCategories([]);

        try {
            const result = await fetchFromAPI(`/categories?parent=${categoryId}`, { credentials: "include" });
            setSubCategories(result.data || result || []);
        } catch (err) { console.error(err); }
    };

    const handleSubCategoryChange = async (e) => {
        const subId = e.target.value;
        setFilters({ ...filters, subCategory: subId, subSubCategory: "" });

        if (!subId) return setSubSubCategories([]);

        try {
            const result = await fetchFromAPI(`/categories?parent=${subId}`, { credentials: "include" });
            setSubSubCategories(result.data || result || []);
        } catch (err) { console.error(err); }
    };

    const handleReset = () => {
        setFilters({ brand: "", category: "", subCategory: "", subSubCategory: "" });
        setSearch("");
        setSubCategories([]);
        setSubSubCategories([]);
        setPage(1);
    };

    // Toggle Status Pipeline for Global Schema Actions
    const handleToggleStatus = async (id, field, currentValue) => {
        try {
            // Mapping schema fields smoothly
            let updatedValue = !currentValue;
            if (field === "status") {
                updatedValue = currentValue === "ACTIVE" ? "INACTIVE" : "ACTIVE";
            }

            const result = await fetchFromAPI(`/Adminproducts/toggle-status`, {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify({ id, field, value: updatedValue })
            });
            if (result.ok) {
                setProducts(products.map(p => p._id === id ? { ...p, [field]: updatedValue } : p));
            }
        } catch (err) { console.error(err); }
    };

    const handleEdit = (product) => {
        setEditFormData({
            id: product._id,
            productName: product.productName,
            price: product.price,
            stock: product.stock || 0,
            status: product.status || "ACTIVE",
            listingType: product.listingType || "BESTSELLER"
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const result = await fetchFromAPI(`/Adminproducts/${editFormData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(editFormData)
            });

            if (result.ok) {
                setProducts(products.map(p => p._id === editFormData.id ? { ...p, ...editFormData } : p));
                setIsEditModalOpen(false);
            }
        } catch (err) {
            console.error("Update payload error:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product listing from the master catalogue?")) {
            try {
                const result = await fetchFromAPI(`/Adminproducts/${id}`, {
                    method: "DELETE",
                    credentials: "include"
                });
                if (result.ok) {
                    setProducts(products.filter(p => p._id !== id));
                    setTotalCount(prev => prev - 1);
                }
            } catch (err) { console.error(err); }
        }
    };

    // Helper to format stock badges cleanly like Flipkart's inventory engine
    const getStockBadge = (stock, status) => {
        if (stock <= 0 || status === "OUT_OF_STOCK") {
            return <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-md">Out of Stock</span>;
        }
        if (stock <= 10 || status === "LOW_STOCK") {
            return <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-md">Low Stock ({stock})</span>;
        }
        return <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md">In Stock ({stock})</span>;
    };

    return (
        <div className="p-3 md:p-6 bg-[#f4f6f9] min-h-screen text-slate-800 font-sans tracking-tight">

            {/* Real E-commerce Header Metric Blocks */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        Master Product Catalogue
                        <span className="bg-blue-600 text-white px-2.5 py-0.5 text-xs font-semibold rounded-full shadow-sm">{totalCount} items</span>
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 mt-0.5">Manage warehouse stock, listing visibilities, tags, and automated price rules.</p>
                </div>
            </div>

            {/* Amazon-Inspired Multi-Tier Filter Block */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-xs border border-slate-200/80 mb-6">
                <div className="flex items-center gap-2 font-bold text-slate-900 border-b pb-3 mb-4 text-sm uppercase tracking-wider text-slate-500">
                    <FaFilter className="text-blue-500 text-xs" /> Filter Matrix
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Brand</label>
                        <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })}>
                            <option value="">All Brands</option>
                            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Primary Category</label>
                        <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={filters.category} onChange={handleCategoryChange}>
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Sub Category</label>
                        <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={filters.subCategory} onChange={handleSubCategoryChange}>
                            <option value="">Select Sub Category</option>
                            {subCategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Sub-Sub Category</label>
                        <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" value={filters.subSubCategory} onChange={(e) => setFilters({ ...filters, subSubCategory: e.target.value })}>
                            <option value="">Select Sub Sub Category</option>
                            {subSubCategories.map(ss => <option key={ss._id} value={ss._id}>{ss.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-slate-100">
                    <button onClick={handleReset} className="px-5 py-2 font-medium bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-all">Reset System</button>
                    <button onClick={() => { setPage(1); fetchProducts(); }} className="px-5 py-2 font-medium bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 shadow-sm shadow-blue-500/10 transition-all">Apply Filter</button>
                </div>
            </div>

            {/* Main Interactive Table & Control Section */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="p-4 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 border-b">
                    <div className="flex border border-slate-300 rounded-lg overflow-hidden w-full lg:w-96 shadow-2xs">
                        <input type="text" placeholder="Search by name, SKU, HSN, tags..." className="flex-1 px-3 py-2 text-sm outline-none focus:bg-slate-50/50 transition-all" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button onClick={() => { setPage(1); fetchProducts(); }} className="bg-slate-900 text-white px-4 hover:bg-black text-sm flex items-center gap-2 transition-all"><FaSearch /></button>
                    </div>
                    <div className="flex items-center gap-2 self-end lg:self-auto w-full lg:w-auto justify-end">
                        <button className="border border-slate-300 px-4 py-2 bg-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 shadow-2xs transition-all"><FaDownload className="text-slate-500" /> Export CSV</button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 shadow-sm shadow-blue-600/10 transition-all"><FaPlus /> Create Entry</button>
                    </div>
                </div>

                {/* Desktop View Matrix (Visible on Tablet/Desktop md+) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                            <tr>
                                <th className="px-4 py-3.5 font-bold w-12 text-center">Index</th>
                                <th className="px-4 py-3.5 font-bold">Product Blueprint</th>
                                <th className="px-4 py-3.5 font-bold">Category & Brand</th>
                                <th className="px-4 py-3.5 font-bold">Financial Matrix</th>
                                <th className="px-4 py-3.5 font-bold text-center">Inventory Health</th>
                                <th className="px-4 py-3.5 font-bold text-center">Badges</th>
                                <th className="px-4 py-3.5 font-bold text-center">Marketplace Status</th>
                                <th className="px-4 py-3.5 font-bold text-center w-28">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150 text-slate-700">
                            {products.map((product, index) => (
                                <tr key={product._id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-4 py-4 text-center font-mono text-xs text-slate-400">{(page - 1) * 10 + (index + 1)}</td>
                                    <td className="px-4 py-4 max-w-xs">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={getImageUrl(product.thumbnail)}
                                                alt={product.productName}
                                                className="w-12 h-12 rounded-lg shadow-2xs border border-slate-200 object-cover flex-shrink-0 bg-slate-50"
                                            />
                                            <div className="truncate min-w-0">
                                                <p className="font-semibold text-slate-900 truncate text-sm" title={product.productName}>{product.productName}</p>
                                                <p className="text-xs font-mono text-slate-400 mt-0.5 tracking-tight">SKU: {product.sku || "N/A"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-xs space-y-0.5">
                                            <div className="font-semibold text-slate-800 flex items-center gap-1"><FaLayerGroup className="text-slate-400 text-[10px]" /> {product.category || "General"}</div>
                                            {product.brand && <div className="text-slate-500 flex items-center gap-1"><FaTag className="text-slate-400 text-[10px]" /> {product.brand}</div>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-xs">
                                            <span className="text-sm font-bold text-slate-900">₹{product.discountPrice > 0 ? product.discountPrice : product.price}</span>
                                            {product.discountAmount > 0 && (
                                                <div className="text-slate-400 line-through mt-0.5">₹{product.price}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {getStockBadge(product.stock, product.stockStatus)}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${product.listingType === "BESTSELLER" ? "bg-orange-100 text-orange-700" :
                                                product.listingType === "NEW_ARRIVAL" ? "bg-purple-100 text-purple-700" : product.listingType === "COMBOS" ? "bg-blue-100 text-blue-700" :
                                                "bg-gray-100 text-gray-700"
                                            }`}>
                                            {product.listingType || "Standard"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col items-center gap-2">
                                            <label className="relative inline-flex items-center cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={product.status === "ACTIVE"}
                                                    onChange={() => handleToggleStatus(product._id, 'status', product.status)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                                <span className="ml-1.5 text-xs font-medium min-w-[42px]">{product.status === "ACTIVE" ? "Active" : "Draft"}</span>
                                            </label>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                                {product.approvedByAdmin ? (
                                                    <span className="text-green-600 flex items-center gap-0.5"><FaCheckCircle /> Approved</span>
                                                ) : (
                                                    <span className="text-slate-400 flex items-center gap-0.5"><FaTimesCircle /> Pending</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center items-center gap-2.5 text-slate-500">
                                            <button onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} className="hover:text-blue-600 p-1 bg-slate-100 hover:bg-blue-50 rounded transition-all" title="Inspect Catalogue"><FaEye className="text-sm" /></button>
                                            <button onClick={() => handleEdit(product)} className="hover:text-green-600 p-1 bg-slate-100 hover:bg-green-50 rounded transition-all" title="Quick Modifications"><FaEdit className="text-sm" /></button>
                                            <button onClick={() => handleDelete(product._id)} className="hover:text-red-600 p-1 bg-slate-100 hover:bg-red-50 rounded transition-all" title="Purge Record"><FaTrash className="text-sm" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Responsive Grid Interface (Visible on screens < 768px) */}
                <div className="grid grid-cols-1 gap-4 p-4 md:hidden bg-slate-50">
                    {products.map((product, index) => (
                        <div key={product._id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col gap-3">
                            <div className="flex gap-3">
                                <img
                                    src={getImageUrl(product.thumbnail)}
                                    alt={product.productName}
                                    className="w-16 h-16 rounded-lg object-cover border bg-slate-50 flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-1">
                                        <h3 className="font-bold text-slate-900 text-sm leading-tight break-words">{product.productName}</h3>
                                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded flex-shrink-0">#{index + 1}</span>
                                    </div>
                                    <p className="text-xs font-mono text-slate-400 mt-1">SKU: {product.sku || "N/A"}</p>
                                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                        <span className="text-xs font-bold text-slate-900">₹{product.discountPrice > 0 ? product.discountPrice : product.price}</span>
                                        {product.discountAmount > 0 && <span className="text-[11px] text-slate-400 line-through">₹{product.price}</span>}
                                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">{product.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                                <div className="flex flex-col gap-1">
                                    {getStockBadge(product.stock, product.stockStatus)}
                                    <span className="text-[10px] text-slate-400">{product.approvedByAdmin ? "✓ Authorized Admin" : "⚠️ Awaiting Approval"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"><FaEye className="text-xs" /></button>
                                    <button onClick={() => handleEdit(product)} className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-green-50 hover:text-green-600 transition-all"><FaEdit className="text-xs" /></button>
                                    <button onClick={() => handleDelete(product._id)} className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"><FaTrash className="text-xs" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Micro-Tailwind Clean Pagination Footer */}
                <div className="p-4 border-t flex items-center justify-between bg-white">
                    <p className="text-xs font-medium text-slate-500 hidden sm:block">
                        Showing page <span className="font-bold text-slate-800">{page}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
                    </p>
                    <div className="flex gap-1 shadow-2xs rounded-lg overflow-hidden border border-slate-200">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 bg-white font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors">Prev</button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1.5 font-medium border-l text-xs transition-all ${page === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>{i + 1}</button>
                        ))}
                        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 bg-white font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 border-l transition-colors">Next</button>
                    </div>
                </div>
            </div>

            {/* --- DETAILED DIALOG MODAL (AMAZON INSPECTOR LAYOUT) --- */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-3 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl transition-all border border-slate-100">
                        <div className="p-4 md:p-5 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Product Extended Specification</h2>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {selectedProduct._id}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 text-2xl transition-colors font-light">&times;</button>
                        </div>

                        <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
                            <div className="md:col-span-2 space-y-3">
                                <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200/60 flex items-center justify-center aspect-square shadow-2xs">
                                    <img
                                        src={getImageUrl(selectedProduct.thumbnail)}
                                        alt={selectedProduct.productName}
                                        className="object-contain w-full h-full p-3"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {selectedProduct.images?.slice(0, 3).map(( itemIdx) => (
                                        <div key={itemIdx} className="aspect-square border border-slate-200 rounded bg-slate-50 overflow-hidden">
                                            <img src={getImageUrl(selectedProduct.thumbnail)} alt = "No Image" className="object-cover w-full h-full"/>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-3 space-y-4 min-w-0">
                                <div>
                                    <span className="bg-slate-900 text-white font-mono font-bold tracking-wider text-[9px] px-1.5 py-0.5 rounded uppercase">{selectedProduct.hsnCode ? `HSN-${selectedProduct.hsnCode}` : "No HSN"}</span>
                                    <h3 className="text-xl font-extrabold text-slate-900 mt-1 leading-tight">{selectedProduct.productName}</h3>
                                    <p className="text-xs font-semibold text-blue-600 mt-0.5">{selectedProduct.category} / {selectedProduct.subCategory || "General"}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2.5">
                                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">M.R.P</p>
                                        <p className="text-sm font-black text-slate-900 mt-0.5">₹{selectedProduct.price}</p>
                                    </div>
                                    <div className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-100/40">
                                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Sale Price</p>
                                        <p className="text-sm font-black text-blue-900 mt-0.5">₹{selectedProduct.discountPrice || selectedProduct.price}</p>
                                    </div>
                                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stock Qty</p>
                                        <p className="text-sm font-black text-slate-900 mt-0.5">{selectedProduct.stock || 0} {selectedProduct.weightUnit || "pcs"}</p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-150 pt-3 text-xs space-y-1.5 text-slate-600">
                                    <div className="flex justify-between"><span className="text-slate-400 font-medium">Type:</span> <span className="font-bold text-slate-800">{selectedProduct.productType || "Physical"}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-400 font-medium">Shipping Tier:</span> <span className="font-bold text-slate-800">{selectedProduct.shippingType || "PAID"} (₹{selectedProduct.shippingCharge || 0})</span></div>
                                    <div className="flex justify-between"><span className="text-slate-400 font-medium">Origin Matrix:</span> <span className="font-bold text-slate-800">{selectedProduct.countryOfOrigin || "India"}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-400 font-medium">Return Windows:</span> <span className="font-bold text-slate-800">{selectedProduct.returnable ? `${selectedProduct.returnDays || 7} Days Return Policy` : "Non-Returnable"}</span></div>
                                </div>

                                <div className="border-t pt-3">
                                    <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Product Storyboard</p>
                                    <div className="text-xs text-slate-600 leading-relaxed max-h-24 overflow-y-auto pr-1 bg-slate-50/50 p-2 rounded-lg border border-dashed" dangerouslySetInnerHTML={{ __html: selectedProduct.description || "<em>No core description filed.</em>" }} />
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 border-t flex justify-end rounded-b-2xl">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-black text-xs font-bold transition-all shadow-2xs">Close Sheet</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CORE DATA MODIFICATION MODAL --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-100 transition-all">
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-xl">
                            <h2 className="text-base font-bold text-slate-900">Quick-Edit Operational Values</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-xl font-light text-slate-400 hover:text-slate-600">&times;</button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-5 space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-600 mb-1 uppercase">Catalogue Product Label</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    value={editFormData.productName}
                                    onChange={(e) => setEditFormData({ ...editFormData, productName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-600 mb-1 uppercase">Base Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        value={editFormData.price}
                                        onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 mb-1 uppercase">Warehouse Inventory</label>
                                    <input
                                        type="number"
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        value={editFormData.stock}
                                        onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-600 mb-1 uppercase">Listing Type Badge</label>
                                    <select
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                                        value={editFormData.listingType}
                                        onChange={(e) => setEditFormData({ ...editFormData, listingType: e.target.value })}
                                    >
                                        <option value="BESTSELLER">Bestseller</option>
                                        <option value="NEW_ARRIVAL">New Arrival</option>
                                        <option value="COMBOS">Combos</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-600 mb-1 uppercase">Market Status</label>
                                    <select
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                                        value={editFormData.status}
                                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                        <option value="DRAFT">Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-2">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-xs">Save Updates</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}