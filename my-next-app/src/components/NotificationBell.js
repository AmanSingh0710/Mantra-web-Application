"use client";

import { fetchFromAPI } from "@/utils/api";
import { useEffect, useState, useRef } from "react";
import { Bell, Inbox, X, Circle } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(null);
  const dropdownRef = useRef(null);

  // ✅ Load token
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    if (!token) return;

    try {
      const data = await fetchFromAPI("/notifications/user/list");
      setNotifications(data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  // ✅ Fetch ONLY when dropdown opens
  useEffect(() => {
    if (token && open) {
      fetchNotifications();
    }
  }, [token, open]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ✅ Mark as read
  const handleMarkAsRead = async (id) => {
    if (!token) return;

    try {
      await fetchFromAPI(`/notifications/read/${id}`, {
        method: "PUT",
      });

      // Optimistic UI update
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>

      {/* 🔔 Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-gray-100 rounded-full relative group"
      >
        <Bell
          size={24}
          className={
            unreadCount > 0
              ? "text-blue-600 fill-blue-50"
              : "text-gray-600 group-hover:text-black"
          }
        />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* 📩 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white shadow-xl rounded-xl border z-[999]">

          {/* Header */}
          <div className="px-4 py-3 border-b flex justify-between">
            <h3 className="font-bold text-sm">Notifications</h3>
            <X size={18} onClick={() => setOpen(false)} />
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                <Inbox size={30} />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id)}
                  className={`p-4 cursor-pointer flex gap-3 hover:bg-gray-50 ${!n.isRead ? "bg-blue-50" : ""
                    }`}
                >
                  {!n.isRead && (
                    <Circle size={8} className="text-blue-600 fill-blue-600 mt-2" />
                  )}

                  <div>
                    <p className="text-sm font-semibold">{n.title}</p>
                    <p className="text-xs text-gray-500">{n.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}