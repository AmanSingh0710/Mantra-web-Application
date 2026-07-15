"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";

export default function ResetPassword() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const verified = sessionStorage.getItem("resetVerified");
        const storedEmail = sessionStorage.getItem("resetEmail");
        const storedOTP = sessionStorage.getItem("resetOTP");

        if (!verified || !storedEmail || !storedOTP) {
            toast.error("Reset session expired");
            router.replace("/forgot-password");
            return;
        }

        setEmail(storedEmail);
        setOtp(storedOTP);

    }, [router]);

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
                    newPassword: password,
                }),
            });

            if (!res.success) {
                return toast.error(res.message);
            }

            toast.success(res.message);

            // Cleanup session
            sessionStorage.removeItem("resetEmail");
            sessionStorage.removeItem("resetOTP");
            sessionStorage.removeItem("resetVerified");

            router.replace("/login");

        } catch (err) {
            toast.error(err.message || "Something went wrong");
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
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            resetPassword();
                        }
                    }}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border rounded p-3 mb-6"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            resetPassword();
                        }
                    }}
                />

                <button
                    onClick={resetPassword}
                    disabled={loading}
                    className={`w-full py-3 rounded text-white font-semibold ${
                        loading
                            ? "bg-green-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>

            </div>

        </div>

    );
}