"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";
import { Eye, EyeOff } from "lucide-react";


export default function ChangePasswordPage() {
    const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) return toast.error("Passwords do not match");
        try {
            setLoading(true);
            const res = await fetchFromAPI("/auth/update-password", { method: "PATCH", body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }) });
            toast.success(res.message);
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl bg-white rounded-xl shadow p-8">
            <h1 className="text-2xl font-bold mb-6">Change Password</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block mb-2 text-sm font-medium">Current Password</label>
                    <div className="relative">
                        <input type={show.current ? "text" : "password"} name="currentPassword" value={form.currentPassword} onChange={handleChange} required className="w-full border rounded-lg px-4 py-3" />
                        <button type="button" onClick={() => setShow({ ...show, current: !show.current })} className="absolute right-3 top-3">{show.current ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium">New Password</label>
                    <div className="relative">
                        <input type={show.new ? "text" : "password"} name="newPassword" value={form.newPassword} onChange={handleChange} required minLength={8} className="w-full border rounded-lg px-4 py-3" />
                        <button type="button" onClick={() => setShow({ ...show, new: !show.new })} className="absolute right-3 top-3">{show.new ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Use at least 8 characters.</p>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium">Confirm Password</label>
                    <div className="relative">
                        <input type={show.confirm ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required className="w-full border rounded-lg px-4 py-3" />
                        <button type="button" onClick={() => setShow({ ...show, confirm: !show.confirm })} className="absolute right-3 top-3">{show.confirm ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                </div>
                <button disabled={loading} className="w-full bg-black text-white rounded-lg py-3 hover:bg-gray-800 disabled:opacity-50">{loading ? "Updating..." : "Update Password"}</button>
            </form>
        </div>
    );
}