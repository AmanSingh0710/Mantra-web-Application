"use client";

import { useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
//src/app/forgot-password/page.js
export default function ForgotPassword() {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);


    const sendOTP = async () => {

        const userEmail = email.trim().toLowerCase();

        if (!userEmail) {
            return toast.error("Email is required");
        }

        try {

            setLoading(true);

            const res = await fetchFromAPI("/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email: userEmail })
            });

            if (!res.success) {
                return toast.error(res.message);
            }

            sessionStorage.setItem("resetEmail", userEmail);

            toast.success(res.message);

            router.push(`/verify-reset-otp`);

        } catch (err) {
            toast.error(err.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen flex justify-center items-center">

            <div className="w-[400px] bg-white p-8 rounded shadow">

                <h2 className="text-2xl font-bold mb-6 text-black">
                    Forgot Password
                </h2>

                <input
                    type="email"
                    placeholder="Enter Email"
                    className="border p-3 w-full rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendOTP();
                        }
                    }}
                />

                <button
                    type="button"
                    onClick={sendOTP}
                    disabled={loading}
                    className={`mt-5 w-full p-3 rounded text-white font-semibold transition
    ${loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Sending OTP..." : "Send OTP"}
                </button>

            </div>

        </div>

    );

}