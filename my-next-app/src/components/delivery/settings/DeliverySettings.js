"use client";
import { useState } from "react";
export default function DeliverySettings() {

    const [notifications, setNotifications] = useState(true);

    return <div className="bg-white border rounded-xl p-6 text-gray-900">

        <h1 className="text-2xl font-bold mb-4">Settings</h1>

        <label className="flex gap-3 items-center">
            <input type="checkbox" checked={notifications}
                onChange={() => setNotifications(!notifications)} />Enable Notifications
        </label>
    </div>
}
