"use client";

import { fetchFromAPI } from "@/utils/api";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Plus, Edit, Trash2, Star, X } from "lucide-react";

export default function ProductsPage() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [currentProduct, setCurrentProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
    rating: "",
    isFeatured: false,
    discountPercent: "",
    offerText: "",
  });

  const searchParams = useSearchParams();

  const [brands, setBrands] = useState([]);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [brandForm, setBrandForm] = useState({ name: "", image: "" });

  // ================= BRANDS =================
  const fetchBrands = async () => {
    try {
      const res = await fetchFromAPI("/brands");
      const data = await res.json();
      setBrands(data);
    } catch {
      toast.error("Failed to load brands");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleBrandSubmit = async (e) => {
    e.preventDefault();

    const res = await fetchFromAPI("/brands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(brandForm),
    });

    if (res.ok) {
      toast.success("Brand Added!");
      setBrandForm({ name: "", image: "" });
      fetchBrands();
      setShowBrandModal(false);
    }
  };

  // ================= PRODUCTS =================
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchFromAPI("/products");
      const data = await res.json();
      setProducts(data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("add") === "true") setShowAddModal(true);

    fetchProducts();
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ================= ADD PRODUCT =================
  const addProduct = async (e) => {
    e.preventDefault();

    const res = await fetchFromAPI("/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success("Product Created!");
      setShowAddModal(false);
      resetForm();
      fetchProducts();
    }
  };

  // ================= EDIT =================
  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image,
      rating: product.rating,
      isFeatured: product.isFeatured || false,
    });
    setShowEditModal(true);
  };

  // ================= UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetchFromAPI(`/products/${currentProduct._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success("Product Updated!");
      setShowEditModal(false);
      fetchProducts();
    }
  };

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    if (!confirm("Are you sure?")) return;

    const res = await fetchFromAPI(`/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      toast.success("Deleted!");
      fetchProducts();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      image: "",
      rating: "",
      isFeatured: false,
      discountPercent: "",
      offerText: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <Toaster position="top-right" />

      {/* Header Area */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500">Manage your MongoDB products and stock</p>
        </div>
        {user?.role === "ADMIN" && (
          <button onClick={() => { resetForm(); setShowAddModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all">
            <Plus size={20} /> Add New Product
          </button>
        )}
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (

          <div key={product._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            <div className="h-52 bg-white p-4 relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-slate-100">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold">{product.rating}</span>
              </div>
            </div>
            <div className="p-5 border-t border-slate-50">
              <span className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">{product.category}</span>
              <h2 className="font-bold text-slate-800 line-clamp-1 text-lg mb-2">{product.name}</h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-slate-900 font-mono">₹{product.price}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                </span>
              </div>
              <div className="flex gap-2">
                {user?.role === "ADMIN" ? (
                  <>
                    <button onClick={() => openEditModal(product)} className="flex-1 flex justify-center items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold transition-all">
                      <Edit size={16} /> Edit
                    </button>
                    <button onClick={() => deleteProduct(product._id)} className="w-12 flex justify-center items-center bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </>
                ) : (
                  <button className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95">Add to Cart</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SHARED MODAL FOR ADD & EDIT */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-slate-50 px-8 py-5 border-b flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {showAddModal ? "New Product Listing" : "Update Product Info"}
              </h2>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="p-2 hover:bg-white rounded-full transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={showAddModal ? addProduct : handleUpdate} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4 md:col-span-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Product Title</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium" placeholder="Enter name" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Price (₹)</label>
                <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Stock Quantity</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Category</label>
                <input required name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Rating</label>
                <input required step="0.1" type="number" name="rating" value={formData.rating} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium" />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Image URL</label>
                <input required name="image" value={formData.image} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium" />
              </div>

              {/* Discount & Offer Section */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Discount (%)</label>
                <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium" placeholder="e.g. 10" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Offer Label</label>
                <input name="offerText" value={formData.offerText} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium" placeholder="e.g. SBI Bank Offer" />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium h-24" />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                <button type="submit" className="px-10 py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all">
                  {showAddModal ? "Create Listing" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}