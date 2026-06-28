"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";

export default function ResetPassword() {

    const router = useRouter();

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const email =
        typeof window !== "undefined"
            ? localStorage.getItem("resetEmail")
            : "";

    const otp =
        typeof window !== "undefined"
            ? localStorage.getItem("verifiedOTP")
            : "";

    const resetPassword = async () => {

        if (!password || !confirmPassword) {
            return toast.error("All fields are required");
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {

            setLoading(true);

            const res = await fetchFromAPI("/auth/reset-password", {

                method: "POST",

                body: JSON.stringify({

                    email,

                    otp,

                    newPassword: password

                })

            });

            toast.success(res.message);

            localStorage.removeItem("resetEmail");

            localStorage.removeItem("verifiedOTP");

            router.push("/login");

        } catch (err) {

            toast.error(err.message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow w-[420px]">

                <h2 className="text-2xl font-bold mb-6">
                    Reset Password
                </h2>

                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border rounded p-3 mb-4"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border rounded p-3 mb-6"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                />

                <button
                    onClick={resetPassword}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>

            </div>

        </div>

    );

}