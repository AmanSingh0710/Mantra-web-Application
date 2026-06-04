"use client";

import { useState } from "react";
import { FaEnvelope, FaSpinner } from "react-icons/fa";
import { fetchFromAPI } from "@/utils/api";

export default function NewsletterUI() {
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    type: "",
    text: "",
  });

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter your email address.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetchFromAPI("/subscribers/add", {
        method: "POST",
        body: JSON.stringify({
          email,
          source: "Homepage",
        }),
      });

      setStatusMessage({
        type: "success",
        text: response?.message || "Subscribed successfully!",
      });

      setEmail("");
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-12 bg-gray-50 border-t border-gray-200">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Join the Mantra Herbal Newsletter</h2>
        <p className="text-gray-600 mb-6 text-sm">Get skincare tips, offers & new launch updates!</p>

        <form onSubmit={handleSubscribeSubmit} className="relative">
          <div className="flex items-center relative border border-gray-300 rounded bg-white shadow-sm focus-within:border-amber-500 transition-all duration-200">
            <FaEnvelope className="text-gray-400 ml-3 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="youremail123@gmail.com"
              disabled={loading}
              className="w-full pl-3 pr-28 py-3 text-sm text-gray-800 bg-transparent placeholder-gray-400 focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1 top-1 bottom-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 rounded text-xs tracking-wider transition-colors duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[110px]"
            >
              {loading ? <FaSpinner className="animate-spin text-lg" /> : "SUBSCRIBE"}
            </button>
          </div>
        </form>

        {/* Status Feedback Notification Alert */}
        {statusMessage?.text && (
          <div className={`mt-4 text-sm font-medium p-2.5 rounded border transition-all duration-200 ${statusMessage?.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
            }`}>
            {statusMessage.text}
          </div>
        )}
      </div>
    </section>
  );
}