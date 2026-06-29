"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";

export default function VerifyResetOTP() {
    const router = useRouter();

    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // Get email from sessionStorage
    useEffect(() => {
        const storedEmail = sessionStorage.getItem("resetEmail");

        if (!storedEmail) {
            toast.error("Reset session expired");
            router.replace("/forgot-password");
            return;
        }

        setEmail(storedEmail);
    }, [router]);

    const verifyOTP = async () => {

        if (!otp.trim()) {
            return toast.error("OTP is required");
        }

        try {

            setLoading(true);

            const res = await fetchFromAPI("/auth/verify-reset-otp", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    otp: otp.trim()
                }),
            });

            if (!res.success) {
                return toast.error(res.message);
            }

            toast.success(res.message);

            // OTP verified
            sessionStorage.setItem("resetOTP", otp.trim());
            sessionStorage.setItem("resetVerified", "true");
            
            router.push("/reset-password");

        } catch (err) {
            toast.error(err.message || "Verification failed");
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
                    type="text"
                    maxLength={6}
                    value={otp}
                    placeholder="Enter OTP"
                    onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            verifyOTP();
                        }
                    }}
                    className="w-full border rounded p-3 mb-6"
                />

                <button
                    onClick={verifyOTP}
                    disabled={loading}
                    className={`w-full py-3 rounded text-white font-semibold ${loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

            </div>

        </div>
    );
}