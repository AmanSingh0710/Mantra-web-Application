"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";

export default function VerifyResetOTP() {

    const router = useRouter();

    const [email, setEmail] = useState(
        typeof window !== "undefined"
            ? localStorage.getItem("resetEmail") || ""
            : ""
    );

    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);

    const verifyOTP = async () => {

        if (!email || !otp) {
            return toast.error("Email and OTP are required");
        }

        try {

            setLoading(true);

            const res = await fetchFromAPI("/auth/verify-reset-otp", {

                method: "POST",

                body: JSON.stringify({
                    email,
                    otp
                })

            });

            toast.success(res.message);

            localStorage.setItem("verifiedOTP", otp);

            router.push("/reset-password");

        } catch (err) {

            toast.error(err.message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow w-[420px]">

                <h1 className="text-2xl font-bold mb-6">
                    Verify OTP
                </h1>

                <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full border rounded p-3 mb-4 bg-gray-100"
                />

                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e)=>setOtp(e.target.value)}
                    className="w-full border rounded p-3 mb-6"
                />

                <button
                    onClick={verifyOTP}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

            </div>

        </div>

    );

}