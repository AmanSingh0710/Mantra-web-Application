"use client";

import { fetchFromAPI } from "@/utils/api";
import { useEffect, useState } from "react";
import { Send, Trash2, Edit3, Bell, Megaphone, Search, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
//src/components/admin/AdminAnnouncemennts.js
export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: "", message: "", priority: 0, });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);

  const [desktopPreview, setDesktopPreview] = useState("");
  const [mobilePreview, setMobilePreview] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const res = await fetchFromAPI("/announcement/list");

      if (res?.success) {
        setAnnouncements(res.announcements || []);
      }
    } catch (err) {
      toast.error("Data Fetching Failed !!!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);


  // ================= SUBMIT (CREATE / UPDATE) =================
  // ================= SUBMIT (CREATE / UPDATE) =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const endpoint = editingId
        ? `/announcement/${editingId}`
        : "/announcement/add";

      const method = editingId
        ? "PUT"
        : "POST";

      const data = new FormData();

      data.append("title", formData.title);
      data.append("message", formData.message);
      data.append("priority", formData.priority || 0);

      // Desktop Image
      if (desktopImage) {
        data.append("desktopImage", desktopImage);
      }

      // Mobile Image
      if (mobileImage) {
        data.append("mobileImage", mobileImage);
      }

      const res = await fetchFromAPI(endpoint, {
        method,
        body: data,
      });

      if (res?.success) {
        toast.success(
          editingId
            ? "Announcement updated successfully"
            : "Announcement created successfully"
        );

        fetchAnnouncements();

        setEditingId(null);

        setFormData({
          title: "",
          message: "",
          priority: 0,
        });

        setDesktopImage(null);
        setMobileImage(null);

        setDesktopPreview("");
        setMobilePreview("");
      }
    } catch (err) {
      toast.error(
        err?.message || "Announcement operation failed"
      );

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      if (!confirm("Delete this announcement?")) return;

      await fetchFromAPI(`/announcement/${id}`, {
        method: "DELETE",
      });

      fetchAnnouncements();
    } catch (err) {
      toast.error("Deleteion Failed !!!");
      console.error(err);
    }
  };

  // ================= EDIT =================
  const handleEdit = (n) => {
    setEditingId(n._id);
    setFormData({
      title: n.title || "",
      message: n.message || "",
      priority: n.priority || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetchFromAPI(
        `/announcement/toggle/${id}`,
        {
          method: "PATCH",
        }
      );

      if (res.success) {
        fetchAnnouncements();
      }
    } catch (err) {
      toast.error("Toggle Failed !!!");
      console.error(err);
    }
  };

  // ================= FILTER =================
  const filteredAnnouncements = announcements.filter((item) =>
    item.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
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

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Priority
                  </label>

                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value, })}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <button className={`w-full py-4 rounded-lg font-black text-sm tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${editingId ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}>
                  <Send size={18} /> {editingId ? "UPDATE BROADCAST" : "SEND TO ALL USERS"}
                </button>


              </form>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-4">

              {filteredAnnouncements.map((n) => (
                <div
                  key={n._id}
                  className="bg-white rounded-xl border p-5 shadow-sm"
                >
                  <div className="flex justify-between items-start">

                    <div>
                      <h3 className="font-bold text-lg">
                        {n.title}
                      </h3>

                      <p className="text-gray-600 mt-2">
                        {n.message}
                      </p>

                      <div className="flex gap-2 mt-3">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${n.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {n.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          Priority {n.priority}
                        </span>

                      </div>
                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleEdit(n)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        onClick={() => handleToggle(n._id)}
                        className={`px-3 py-2 rounded-lg text-white ${n.isActive
                          ? "bg-orange-500"
                          : "bg-green-600"
                          }`}
                      >
                        {n.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        onClick={() => handleDelete(n._id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </div>
                </div>
              ))}

              {filteredAnnouncements.length === 0 && (
                <div className="bg-white p-10 rounded-xl text-center text-gray-500">
                  No announcements found
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}