"use client";

import { useState, useRef } from "react";
import { fetchFromAPI } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
//src/app/admin/hero/page.js
export default function AdminHeroesPage() {
  const [position, setPosition] = useState(0);

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const [preview, setPreview] = useState("");

  // ================= HANDLE IMAGE =================

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only images allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max image size is 5MB");
      return;
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!image) {
        toast.error("Please select hero image");
        return;
      }

      const data = new FormData();

      data.append("position", position);
      data.append("image", image);

      if (!image) {
        toast.error("Please select hero image");
        setLoading(false);
        return;
      }

      const res = await fetchFromAPI("/hero/add", {
        method: "POST",
        body: data,
      });

      if (res?.success) {
        toast.success("Hero banner added successfully");

        setPosition(0);
        setImage(null);
        setPreview("");

        if (fileRef.current) {
          fileRef.current.value = "";
        }
      }
    } catch (error) {

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 text-black">
       <Toaster position="top-right" />
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black">
        Add Hero Banner
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-5 md:p-8 rounded-2xl shadow"
      >
        {/* Position */}

        <div>
          <label className="block mb-2 font-medium">
            Position
          </label>

          <input
            type="number"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className=" w-full border rounded-xl px-4 py-3 outline-none"
          />
        </div>

        {/* Image */}

        <div>
          <label className="block mb-2 font-medium">
            Hero Image
          </label>

          {
            preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-52 object-cover rounded-xl border"
                />
              </div>
            )
          }

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full"
            required
          />
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className={` w-full  bg-black  text-white py-3 rounded-xl font-semibold  hover:bg-gray-800 transition
          ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 text-white"}
          `}
        >
          {loading ? "Uploading..." : "Add Hero Banner"}
        </button>

        {loading && (
          <div className="text-center text-sm text-gray-500">
            Uploading to Cloudinary...
          </div>
        )}
      </form>
    </div>
  );
}