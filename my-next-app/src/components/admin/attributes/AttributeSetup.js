"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch, FaSpinner } from "react-icons/fa";
import { fetchFromAPI } from "@/utils/api"; // ✅ use global API

export default function AttributeSetup() {
  const [attributes, setAttributes] = useState([]);
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // --- 1. READ ---
  const fetchAttributes = async (query = "") => {
    setLoading(true);
    try {
      const data = await fetchFromAPI(`/attributes?search=${query}`);
      setAttributes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  // --- 2. CREATE & UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name is required");

    try {
      if (editId) {
        await fetchFromAPI(`/attributes/${editId}`, {
          method: "PUT",
          body: JSON.stringify({ name }),
        });
      } else {
        await fetchFromAPI(`/attributes`, {
          method: "POST",
          body: JSON.stringify({ name }),
        });
      }

      setName("");
      setEditId(null);
      fetchAttributes();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Operation failed");
    }
  };

  // --- 3. DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      await fetchFromAPI(`/attributes/${id}`, {
        method: "DELETE",
      });
      fetchAttributes();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // --- 4. PREPARE EDIT ---
  const startEdit = (attr) => {
    setEditId(attr._id);
    setName(attr.name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* INPUT SECTION */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b flex items-center gap-2 font-semibold text-gray-700">
          <span className="text-yellow-500">📑</span> Attribute Setup
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className=" text-black space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Attribute Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Size"
                className="w-full p-2.5 border rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setName(""); setEditId(null); }}
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition text-sm"
              >
                Reset
              </button>
              <button
                type="submit"
                className={`px-6 py-2 rounded text-white text-sm font-medium transition ${editId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {editId ? "Update Attribute" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* LIST SECTION */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <h2 className="font-bold text-gray-700">
            Attribute List <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-normal">{attributes.length}</span>
          </h2>

          <div className="flex w-full sm:w-auto border rounded overflow-hidden group focus-within:ring-2 focus-within:ring-blue-100">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 outline-none text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => fetchAttributes(searchTerm)}
              className="bg-blue-600 text-white px-5 flex items-center justify-center hover:bg-blue-700 transition"
            >
              <FaSearch size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-t">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold">
              <tr>
                <th className="px-6 py-4">SL</th>
                <th className="px-6 py-4">Attribute Name</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="3" className="p-10 text-center"><FaSpinner className="animate-spin inline mr-2" /> Loading...</td></tr>
              ) : attributes.length > 0 ? (
                attributes.map((item, index) => (
                  <tr key={item._id} className="hover:bg-blue-50/30 transition group">
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-2 border border-cyan-400 text-cyan-500 rounded hover:bg-cyan-500 hover:text-white transition"
                          title="Edit"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 border border-red-200 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
                          title="Delete"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="p-12 text-center text-gray-400">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}