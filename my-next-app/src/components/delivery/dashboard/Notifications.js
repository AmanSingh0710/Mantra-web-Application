"use client";
import { Bell } from "lucide-react";

export default function DeliveryNotifications({ notifications = [] }) {
    return (
        <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                    <Bell size={20}/>
                    Notifications
                </h2>
                <button className="text-blue-600 text-sm">
                    View All
                </button>
            </div>
            {notifications.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No Notifications
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.slice(0, 5).map((item) => (
                        <div
                            key={item._id}
                            className="border-b pb-3 last:border-none"
                        >
                            <h4 className="font-semibold">
                                {item.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {item.description}
                            </p>
                            <span className="text-xs text-gray-400">
                                {new Date(item.createdAt).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}