"use client";

import { useState, useEffect } from "react";
import { fetchFromAPI } from "@/utils/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    const userId =
        typeof window !== "undefined"
            ? localStorage.getItem("verifyUserId")
            : null;

    // ⏳ Timer for resend
    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    // ✅ Verify OTP
    const handleVerify = async () => {
        if (!otp) {
            toast.error("Enter OTP");
            return;
        }

        setLoading(true);

        try {
            const data = await fetchFromAPI("/otp/verify-email", {
                method: "POST",
                body: JSON.stringify({ userId, otp }),
            });

            toast.success("Email verified successfully ✅");

            // ✅ save login data
            localStorage.setItem("accessToken",data.accessToken);

            localStorage.setItem("refreshToken",data.refreshToken);

            localStorage.setItem("user",JSON.stringify(data.user));

            toast.success("Account verified successfully 🎉");

            router.push("/");

            // // mobile verification
            // router.push("/verify-mobile");

        } catch (err) {
            toast.error(err.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // 🔁 Resend OTP
    const handleResend = async () => {
        try {
            await fetchFromAPI("/otp/resend-email-otp", {
                method: "POST",
                body: JSON.stringify({ userId }),
            });

            toast.success("OTP sent again 📩");
            setTimer(30);

        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

                <h2 className="text-xl font-bold mb-4 text-center text-black">
                    Verify Your Email
                </h2>

                <p className="text-sm text-gray-500 text-center mb-6">
                    Enter the OTP sent to your email
                </p>

                {/* OTP Input */}
                <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full border p-3 rounded text-center text-lg tracking-widest outline-none text-black"
                />

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded mt-4"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

                {/* Resend */}
                <div className="text-center mt-4">
                    {timer > 0 ? (
                        <p className="text-sm text-gray-500">
                            Resend OTP in {timer}s
                        </p>
                    ) : (
                        <button
                            onClick={handleResend}
                            className="text-blue-600 font-semibold"
                        >
                            Resend OTP
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}