"use client";

import { fetchFromAPI } from "@/utils/api";
import { useEffect, useState } from "react";
import { Send, Trash2, Edit3, Bell, Megaphone, Search, X, CheckCircle } from "lucide-react";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ================= FETCH =================
  const fetchNotifications = async () => {
    try {
      const data = await fetchFromAPI("/announcement", {
        method: "GET",
      });

      setNotifications(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ================= SUBMIT (CREATE / UPDATE) =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = editingId
        ? `/announcement/${editingId}`
        : "/announcement";

      await fetchFromAPI(endpoint, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(formData),
      });

      setFormData({ title: "", message: "" });
      setEditingId(null);
      fetchNotifications();
    } catch (err) {
      alert(err.message);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this announcement?")) return;

    try {
      await fetchFromAPI(`/announcement/${id}`, {
        method: "DELETE",
      });

      fetchNotifications();
    } catch (err) {
      alert(err.message);
    }
  };

  // ================= EDIT =================
  const handleEdit = (n) => {
    setEditingId(n._id);
    setFormData({ title: n.title, message: n.message });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= FILTER =================
  const filteredNotifications = notifications.filter((n) =>
    n.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6] p-4 md:p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Megaphone className="text-blue-600" /> Announcement Manager
            </h1>
            <p className="text-gray-500 text-sm">Send real-time updates to all customer notification bells.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: ACTION FORM */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
              <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider text-xs">
                  {editingId ? "Edit Announcement" : "New Announcement"}
                </span>
                {editingId && <X className="cursor-pointer" onClick={() => { setEditingId(null); setFormData({ title: "", message: "" }) }} />}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Weekend Flash Sale!"
                    className="w-full border-2 border-gray-200 p-3 rounded-lg text-gray-900 font-bold focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase mb-2">Detailed Message</label>
                  <textarea
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe the offer or update..."
                    className="w-full border-2 border-gray-200 p-3 rounded-lg text-gray-900 font-medium focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                    required
                  />
                </div>

                <button className={`w-full py-4 rounded-lg font-black text-sm tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${editingId ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}>
                  <Send size={18} /> {editingId ? "UPDATE BROADCAST" : "SEND TO ALL USERS"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: LIST VIEW */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border-2 border-dashed border-gray-200">
                  <Bell className="mx-auto text-gray-200 mb-2" size={48} />
                  <p className="text-gray-400 font-medium">No announcements found</p>
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <div key={n._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle size={16} className="text-green-500" />
                        <h3 className="font-bold text-gray-900">{n.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{n.message}</p>
                      <div className="mt-3 flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        <span>Sent to: All Users</span>
                        <span>•</span>
                        <span>Status: Live</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(n)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-bold transition-all"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(n._id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg text-sm font-bold transition-all"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
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