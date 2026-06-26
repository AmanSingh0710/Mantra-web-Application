"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";
//src/app/admin/concerns/[id]/page.js
export default function ConcernsPage() {
  const [concerns, setConcerns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(0);
  const [image, setImage] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // ================= DATA FETCHING =================

  const fetchConcerns = async () => {
    try {
      const data = await fetchFromAPI("/concerns/admin/all", { credentials: "include" });
      if (data.success) setConcerns(data.concerns);
    } catch (error) {
      console.error("Failed fetching concerns:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await fetchFromAPI("/categories/public", { credentials: "include" });
      if (data.success) setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchConcerns();
    fetchCategories();
  }, []);

  // ================= MUTATIONS =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("priority", priority);

      if (image) formData.append("image", image);
      selectedCategories.forEach((id) => formData.append("categories", id));

      let data;
      if (editingId) {
        data = await fetchFromAPI(`/concerns/update/${editingId}`, {
          method: "PUT",
          body: formData,
        });
        toast.success("Concern updated successfully");
      } else {
        data = await fetchFromAPI("/concerns/create", {
          method: "POST",
          body: formData,
        });
        toast.success("Concern created successfully");
      }

      if (data.success) {
        setEditingId(null);
        setTitle("");
        setPriority(0);
        setImage(null);
        setSelectedCategories([]);
        fetchConcerns();
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const deleteConcern = async (id) => {
    if (!window.confirm("Are you sure you want to delete this concern?")) return;

    try {
      const data = await fetchFromAPI(`/concerns/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (data.success) {
        toast.success("Deleted successfully");
        fetchConcerns();
      }
    } catch (error) {
      toast.error("Delete operation failed");
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setPriority(item.priority);
    setSelectedCategories(
      item.categories?.map((cat) => (typeof cat === "object" ? cat._id : cat)) || []
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Concern Management</h1>
      </div>

      {/* COMPACT CONTROL FORM */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Concern Name</label>
            <input
              type="text"
              placeholder="e.g., Acne Prone, Dry Skin"
              className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:border-black transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Display Priority</label>
            <input
              type="number"
              placeholder="0"
              className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:border-black transition-colors"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Feature Image</label>
          <input
            type="file"
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="border-t border-gray-100 pt-3">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Related Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <label key={cat._id} className="flex gap-2 items-center text-sm font-medium text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  value={cat._id}
                  className="rounded text-black focus:ring-black h-4 w-4 border-gray-300"
                  checked={selectedCategories.includes(cat._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, cat._id]);
                    } else {
                      setSelectedCategories(selectedCategories.filter((id) => id !== cat._id));
                    }
                  }}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-black hover:bg-gray-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm">
            {editingId ? "Update Concern" : "Save Concern"}
          </button>
        </div>
      </form>

      {/* RESPONSIVE DATA TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="p-4 w-20">Image</th>
                <th className="p-4">Concern</th>
                <th className="p-4 w-32">Priority</th>
                <th className="p-4 w-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {concerns.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900">{item.title}</td>
                  <td className="p-4 text-gray-500">{item.priority}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="text-blue-600 hover:text-blue-900 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteConcern(item._id)}
                      className="text-red-600 hover:text-red-900 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {concerns.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 py-12 font-medium">
                    No records found in database
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}