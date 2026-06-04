//src/components/admin/Notification/PushNotificationSetup.js
"use client";

import { BASE_URL } from "@/utils/api";
import React, { useState, useEffect } from "react";
import { Bell, Cloud, Info, RotateCcw, Send } from "lucide-react";
import toast from "react-hot-toast";

const PushNotificationSetup = () => {
  const [activeTab, setActiveTab] = useState("push");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("Customer");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔥 Fetch Settings
  const fetchSettings = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/notifications/settings?userType=${userType}`
      );

      const data = await res.json();
      setFormData(data || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [userType]);

  const handleToggle = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔥 Submit Settings
  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/notifications/settings/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userType,
            ...formData,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Settings updated successfully ✅");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong ❌");
    }
  };

  const handleReset = () => {
    fetchSettings();
  };

  const notificationFields = [
    { id: "order_pending", label: "Order Pending Message" },
    { id: "order_confirmation", label: "Order Confirmation Message" },
    { id: "order_processing", label: "Order Processing Message" },
    { id: "order_out_delivery", label: "Order Out For Delivery Message" },
    { id: "order_delivered", label: "Order Delivered Message" },
    { id: "order_returned", label: "Order Returned Message" },
    { id: "order_failed", label: "Order Failed Message" },
    { id: "order_canceled", label: "Order Canceled Message" },
    { id: "order_refunded", label: "Order Refunded Message" },
    { id: "refund_request_canceled", label: "Refund Request Canceled Message" },
    { id: "delivery_man_msg", label: "Message From Delivery Man" },
    { id: "seller_msg", label: "Message From Seller" },
    { id: "admin_fund_msg", label: "Fund Added By Admin Message" },
    { id: "admin_msg", label: "Message From Admin" },
  ];

  return (
    <div className="p-4 md:p-6 bg-[#f8f9fa] min-h-screen">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Bell className="text-blue-600 w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Push Notification Setup</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs & Documentation Link */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b px-4 py-2 gap-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("push")}
              className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "push" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
            >
              <Bell size={16} /> Push Notification
            </button>
            <button
              onClick={() => setActiveTab("firebase")}
              className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "firebase" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
            >
              <Cloud size={16} /> Firebase Configuration
            </button>
          </div>
          <a href="#" className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline">
            Read Documentation <Info size={14} />
          </a>
        </div>

        {/* User Type Dropdown */}
        <div className="p-4 md:p-8">
          {/* Language and Target Dropdown */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="font-bold text-blue-600 border-b-2 border-blue-600 pb-1">English(EN)</h3>
            <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full md:w-48 p-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Customer">For Customer</option>
              <option value="Seller">For Seller</option>
              <option value="DeliveryMan">For Delivery Man</option>
            </select>
          </div>

          {/* Messages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notificationFields.map((field) => (
              <div key={field.id} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700">{field.label}</label>
                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData[field.id + "_status"] || false}
                      onChange={() => handleToggle(field.id + "_status")}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <textarea
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  placeholder={`Write ${field.label.toLowerCase()}...`}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-10">
            <button onClick={handleReset} className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors">
              <RotateCcw size={18} /> Reset
            </button>
            <button onClick={handleSubmit} className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-shadow shadow-md">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationSetup;