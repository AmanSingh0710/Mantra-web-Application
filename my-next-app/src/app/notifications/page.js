"use client";

// src/app/notifications/page.js
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'unread'

  const loadNotifications = async () => {
    try {
      const res = await fetchFromAPI("/notifications/user/list");
      setNotifications(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "unread") return !item.isRead;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Notifications
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full dynamic-pulse">
                  {notifications.filter(n => !n.isRead).length} New
                </span>
              )}
            </h1>
          </div>

          {/* Amazon/Flipkart style Filter Tabs */}
          <div className="flex gap-2 border-b border-gray-200 text-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2.5 px-4 font-medium transition-all relative ${
                activeTab === "all"
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`pb-2.5 px-4 font-medium transition-all relative ${
                activeTab === "unread"
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Notifications List Container */}
        <div className="divide-y divide-gray-100">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium text-base">No notifications found</p>
              <p className="text-gray-400 text-sm mt-1">We'll let you know when something updates!</p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item._id}
                className={`p-4 sm:p-5 flex gap-4 transition-all duration-200 cursor-pointer hover:bg-gray-50/80 items-start ${
                  !item.isRead ? "bg-blue-50/40 hover:bg-blue-50/70" : "bg-white"
                }`}
              >
                {/* Unread Status Dot Indicator */}
                <div className="flex-shrink-0 pt-1.5">
                  <span
                    className={`block w-2.5 h-2.5 rounded-full ${
                      !item.isRead ? "bg-blue-600" : "bg-transparent"
                    }`}
                  />
                </div>

                {/* Content Layout */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <div className="space-y-1">
                    <h3 className={`text-sm sm:text-base ${!item.isRead ? "font-semibold text-gray-900" : "text-gray-700 font-medium"}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                    {/* Optional: Add a real fallback or dynamic time here if your item object has a timestamp */}
                    {item.createdAt && (
                      <span className="block text-xs text-gray-400 font-normal pt-1">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Image Section */}
                  {item.image && (
                    <div className="flex-shrink-0 self-start sm:self-center mt-2 sm:mt-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-gray-200/80 shadow-sm bg-gray-50"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}