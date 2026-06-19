"use client";

//sec/app/notifications/page.js
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";

export default function NotificationsPage() {

  const [notifications, setNotifications] = useState([]);

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

  return (
  <div className="max-w-4xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-6">
      Notifications
    </h1>

    {notifications.length === 0 ? (
      <div className="text-center py-10 text-gray-500">
        No notifications found
      </div>
    ) : (
      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item._id}
            className={`border rounded-lg p-4 ${
              !item.isRead ? "bg-blue-50" : "bg-white"
            }`}
          >
            <h3 className="font-semibold text-sm">
              {item.title}
            </h3>

            <p className="text-gray-600 text-sm mt-1">
              {item.description}
            </p>

            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover mt-3"
              />
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);
}