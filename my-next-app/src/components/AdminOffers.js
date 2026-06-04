"use client";

import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import { Tag, Calendar, Trash2, Edit3, Info, X, Percent, IndianRupee } from "lucide-react";

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    applyOn: "GLOBAL",
    startDate: "",
    endDate: "",
  });

  const [editingId, setEditingId] = useState(null);

  // ✅ FETCH OFFERS
  const fetchOffers = async () => {
    try {
      const data = await fetchFromAPI("/offers");
      setOffers(data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = editingId ? `/offers/${editingId}` : "/offers";
    const method = editingId ? "PUT" : "POST";

    try {
      await fetchFromAPI(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      resetForm();
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      applyOn: "GLOBAL",
      startDate: "",
      endDate: "",
    });
    setEditingId(null);
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      try {
        await fetchFromAPI(`/offers/${id}`, {
          method: "DELETE",
        });
        fetchOffers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (offer) => {
    setEditingId(offer._id);
    setFormData({
      ...offer,
      startDate: offer.startDate?.substring(0, 10),
      endDate: offer.endDate?.substring(0, 10),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Offer Management</h1>
            <p className="text-gray-500 text-sm mt-1">Manage discounts, coupons, and seasonal promotional campaigns.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-gray-500 italic">Total Active Offers: </span>
            <span className="font-bold text-blue-600">{offers.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: FORM SECTION */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmit} className="bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden sticky top-8">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold text-gray-700 flex items-center gap-2">
                  <Tag size={18} className="text-blue-500" />
                  {editingId ? "Update Offer Details" : "Create New Offer"}
                </h2>
                {editingId && (
                  <button onClick={resetForm} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
                )}
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Offer Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Diwali Dhamaka Sale"
                    className="w-full border border-gray-300 p-2.5 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Discount Type</label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2.5 rounded bg-white outline-none focus:border-blue-500"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FLAT">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Value</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        {formData.discountType === "PERCENTAGE" ? <Percent size={16} /> : <IndianRupee size={16} />}
                      </span>
                      <input
                        name="discountValue"
                        type="number"
                        value={formData.discountValue}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2.5 pl-9 rounded outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Apply On</label>
                  <select
                    name="applyOn"
                    value={formData.applyOn}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2.5 rounded bg-white outline-none focus:border-blue-500"
                  >
                    <option value="GLOBAL">Global (All Items)</option>
                    <option value="PRODUCT">Specific Products</option>
                    <option value="STORE">Whole Store</option>
                    <option value="CATEGORY">By Category</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Start Date</label>
                    <input
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2.5 rounded outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">End Date</label>
                    <input
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2.5 rounded outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Short summary of the offer..."
                    className="w-full border border-gray-300 p-2.5 rounded outline-none focus:border-blue-500"
                  />
                </div>

                <button className={`w-full py-3 rounded font-bold shadow-sm transition-all ${editingId ? "bg-[#ff9f00] hover:bg-[#f39700] text-white" : "bg-[#2874f0] hover:bg-[#1a65e0] text-white"
                  }`}>
                  {editingId ? "UPDATE OFFER" : "CREATE OFFER"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: LIST SECTION */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {offers.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-lg border border-dashed border-gray-300">
                  <Info className="mx-auto text-gray-300 mb-2" size={48} />
                  <p className="text-gray-500">No active offers found. Create your first campaign.</p>
                </div>
              ) : (
                offers.map((offer) => (
                  <div key={offer._id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow group relative overflow-hidden">
                    {/* Discount Badge */}
                    <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-bl-lg border-l border-b border-green-200">
                      Active
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {offer.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{offer.description}</p>

                        <div className="flex flex-wrap gap-4 mt-4 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            <Tag size={14} className="text-blue-500" />
                            <span className="font-bold text-blue-700">
                              {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} FLAT`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Calendar size={14} />
                            <span>{offer.startDate ? new Date(offer.startDate).toLocaleDateString() : 'N/A'} - {offer.endDate ? new Date(offer.endDate).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2 min-w-[100px]">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="flex items-center justify-center gap-2 border border-gray-300 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors w-full"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(offer._id)}
                          className="flex items-center justify-center gap-2 border border-red-100 px-4 py-2 rounded text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}