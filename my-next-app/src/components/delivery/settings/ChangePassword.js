"use client";
import { useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import toast from "react-hot-toast";
export default function ChangePassword() {
    const [f, setF] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const submit = async () => {
        if (f.newPassword !== f.confirmPassword)
            return toast.error("Passwords do not match");
        try {
            await fetchFromAPI("/deliveryBoy/change-password",
                {
                    method: "PUT",
                    body: JSON.stringify(f)
                });
            toast.success("Password changed");
        }
        catch { toast.error("Failed"); }
    };
    return <div className="bg-white border rounded-xl p-6 space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>

        <input type="password" placeholder="Current Password" className="border p-2 w-full text-gray-900"
            onChange={e => setF({ ...f, currentPassword: e.target.value })} />

        <input type="password" placeholder="New Password" className="border p-2 w-full text-gray-900"
            onChange={e => setF({ ...f, newPassword: e.target.value })} />

        <input type="password" placeholder="Confirm Password" className="border p-2 w-full text-gray-900"
            onChange={e => setF({ ...f, confirmPassword: e.target.value })} />

        <button onClick={submit} className="bg-black text-white px-4 py-2 rounded">Update Password</button>
    </div>
}
