"use client";

import { useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

export default function AdminHeroesPage() {
  const [position, setPosition] = useState(0);

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  // ================= HANDLE IMAGE =================

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("position", position);

      if (image) {
        data.append("image", image);
      }

      const res = await fetchFromAPI("/hero/add", {
        method: "POST",
        body: data,
      });

      if (res?.success) {
        toast.success("Hero banner added successfully");

        setPosition(0);

        setImage(null);
      }
    } catch (error) {

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 text-black">
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
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              outline-none
            "
          />
        </div>

        {/* Image */}

        <div>
          <label className="block mb-2 font-medium">
            Hero Image
          </label>

          <input
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
          className="
            w-full
            bg-black
            text-white
            py-3
            rounded-xl
            font-semibold
            hover:bg-gray-800
            transition
          "
        >
          {loading ? "Uploading..." : "Add Hero Banner"}
        </button>
      </form>
    </div>
  );
}