//src/components/admin/OurStory.js
"use client";
import React, { useState, useEffect } from "react";
import { fetchFromAPI, getImageUrl } from "@/utils/api";
import { FaTrash, FaEye, FaEyeSlash, FaCloudUploadAlt, FaSpinner } from "react-icons/fa";

export default function OurStory() {
  // Form input states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [order, setOrder] = useState(0);

  // System rendering states
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch all stories for Admin Panel layout grid
  const fetchStoriesData = async () => {
    try {
      setLoading(true);
      // Admin route endpoints provide unfiltered access to all database documents
      const response = await fetchFromAPI("/stories");
      if (response?.status === "success") {
        setStories(response.data.stories || []);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch stories database timeline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoriesData();
  }, []);

  // 2. Handle Image File choice selection and buffer generation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Locally renders user preview screen block
    }
  };

  // 3. Post New Story Item to Database via Form Action Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an image asset to publish first!");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Packing variables into Multipart stream block
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("order", order);
      formData.append("image", selectedFile); // Named key matching backend configuration rules

      const response = await fetchFromAPI("/stories/add", {
        method: "POST",
        body: formData, // fetchFromAPI skips standard JSON headers inside your helper structure dynamically
      });

      if (response?.status === "success") {
        alert("New Story uploaded directly to cloud channel! 🎉");
        // Reset states
        setTitle("");
        setDescription("");
        setOrder(0);
        setSelectedFile(null);
        setPreviewUrl("");
        fetchStoriesData(); // Re-sync dashboard array list
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.message || "Failed to finalize database create request.");
    } finally {
      setSubmitting(false);
    }
  };

  // 4. 🔥 FLIPKART STYLE TOGGLE ACTION: Toggle Visibility Status Live 
  const handleToggleStatus = async (storyId, currentStatus) => {
    try {
      const response = await fetchFromAPI(`/stories/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response?.status === "success") {
        // Dynamic state update directly to bypass secondary refresh execution cycles
        setStories((prevStories) =>
          prevStories.map((item) =>
            item._id === storyId ? { ...item, isActive: !currentStatus } : item
          )
        );
      }
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Failed to update banner visibility settings.");
    }
  };

  // 5. Delete Action Handler
  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete this story asset?")) return;

    try {
      await fetchFromAPI(`/stories/${storyId}`, { method: "DELETE" });
      setStories((prevStories) => prevStories.filter((item) => item._id !== storyId));
      alert("Story resource erased successfully.");
    } catch (err) {
      console.error("Delete call crash:", err);
      alert("Could not process structural document deletion request.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: UPLOAD & CREATION CONTAINER FORM */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-fit">
          <h2 className="text-base font-bold text-gray-800 mb-4 border-b pb-2">Create Promotional Story</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">STORY TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Flash Sale"
                required
                className="w-full text-sm border p-2 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">CAMPAIGN DESCRIPTION</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your customer marketing punch line here..."
                required
                rows={3}
                className="w-full text-sm border p-2 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">DISPLAY ORDER</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full text-sm border p-2 rounded focus:outline-none"
                />
              </div>
            </div>

            {/* Drag and Drop Asset Frame block */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">MEDIA SOURCE FILE (9:16 Aspect)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition relative">
                {previewUrl ? (
                  <div className="relative w-full aspect-[9/16] max-h-48 rounded overflow-hidden">
                    {selectedFile?.type?.includes("video") ? (
                      <video src={previewUrl} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <img src={previewUrl} className="w-full h-full object-cover" alt="Preview Asset" />
                    )}
                    <button
                      type="button"
                      onClick={() => { setSelectedFile(null); setPreviewUrl(""); }}
                      className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32">
                    <FaCloudUploadAlt className="text-gray-400 text-3xl mb-1" />
                    <span className="text-xs text-gray-500 font-medium">Click to select asset bundle</span>
                    <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-2.5 rounded text-sm transition flex items-center justify-center gap-2 shadow"
            >
              {submitting ? <FaSpinner className="animate-spin" /> : "Publish to Mantra Fleet"}
            </button>
          </form>
        </div>

        {/* COLUMN 2 & 3: FILTERED AND SECURED REALTIME VIEW GRID */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-base font-bold text-gray-800">System Dashboard Timeline</h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              Total Records: {stories.length}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-2xl text-orange-600" /></div>
          ) : stories.length === 0 ? (
            <div className="text-center py-20 border border-dashed rounded-lg bg-gray-50">
              <p className="text-sm text-gray-400">No story data records available inside backend servers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {stories.map((story) => {
                const isVideo = story.imageUrl?.match(/\.(mp4|webm|ogg|mov)$/i);

                return (
                  <div
                    key={story._id}
                    className="group relative aspect-[9/16] bg-gray-900 border border-gray-200 rounded-xl overflow-hidden flex flex-col justify-between p-3 shadow-sm transition hover:shadow-md"
                  >
                    {/* Shadow overlay gradient wrapper */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40 z-10" />

                    {/* Background Asset Core renderer layer */}
                    {isVideo ? (
                      <video src={getImageUrl(story.imageUrl)} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
                    ) : (
                      <img src={getImageUrl(story.imageUrl)} alt={story.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}

                    {/* TOP ACTION BAR BUTTON GROUPS */}
                    <div className="relative z-20 flex justify-between items-center">
                      {/* 🎯 FLIPKART STYLE TOGGLE STATUS BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(story._id, story.isActive)}
                        className={`text-[9px] font-bold px-2 py-1 rounded-md text-white transition flex items-center gap-1 shadow-sm ${
                          story.isActive ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
                        }`}
                        title={story.isActive ? "Click to set Draft" : "Click to go Live"}
                      >
                        {story.isActive ? <FaEye /> : <FaEyeSlash />}
                        {story.isActive ? "Live" : "Draft"}
                      </button>

                      {/* DELETE ACTION BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleDeleteStory(story._id)}
                        className="p-1.5 bg-red-600/90 text-white rounded-full hover:bg-red-600 transition shadow-sm"
                      >
                        <FaTrash size={9} />
                      </button>
                    </div>

                    {/* BOTTOM TEXT METADATA BAR PANEL */}
                    <div className="relative z-20">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className="text-xs font-bold text-white leading-tight truncate mr-1">
                          {story.title}
                        </p>
                        <span className="text-[9px] bg-white/20 text-white px-1 rounded-md shrink-0">
                          Order: {story.order}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-300 line-clamp-2 leading-tight">
                        {story.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}