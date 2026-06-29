"use client";

import { useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


//src/app/login-otp/page.js
export default function LoginOTPPage() {

    const { refreshUser } = useAuth();

    const router = useRouter();

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");

    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);

    // ✅ SEND OTP
    const handleSendOTP = async () => {

        if (loading) return;

        const userEmail = email.trim().toLowerCase();

        if (!userEmail) {
            return toast.error("Email is required");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(userEmail)) {
            return toast.error("Enter a valid email");
        }

        setLoading(true);

        try {
            const res = await fetchFromAPI("/otp/send-login-otp", {
                method: "POST",
                body: JSON.stringify({
                    email: userEmail
                })
            });

            if (!res.success) { return toast.error(res.message); }

            setEmail(userEmail);

            toast.success(res.message);
            setStep(2);

        } catch (err) {
            toast.error(err.message || "Failed");
        } finally {
            setLoading(false);
        }
    };

    // ✅ VERIFY OTP
   const handleVerifyOTP = async (otpValue = otp) => {

    if (loading) return;

    const enteredOTP = otpValue.trim();

    if (!enteredOTP) {
        return toast.error("Enter OTP");
    }

    if (enteredOTP.length !== 6) {
        return toast.error("Enter valid OTP");
    }

    setLoading(true);

    try {

        const res = await fetchFromAPI("/otp/login-with-otp", {
            method: "POST",
            body: JSON.stringify({
                email,
                otp: enteredOTP
            })
        });

        if (!res.success) {
            return toast.error(res.message);
        }

        toast.success(res.message);

        await refreshUser();

        router.replace("/");

    } catch (err) {
        toast.error(err.message || "Invalid OTP");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

                <h1 className="text-2xl font-bold text-center text-black mb-6">
                    Login With OTP
                </h1>

                {step === 1 && (

                    <>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSendOTP();
                                }
                            }}
                            className="w-full border p-3 rounded-lg mb-4 text-black outline-none"
                        />

                        <button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                        >
                            {
                                loading
                                    ? "Sending..."
                                    : "Send OTP"
                            }
                        </button>
                    </>
                )}

                {step === 2 && (

                    <>
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setOtp(value);

                                if (value.length === 6) {
                                    handleVerifyOTP(value);
                                }
                            }}
                            className="w-full border p-3 rounded-lg mb-4 text-center tracking-[8px] text-black outline-none"
                        />

                        <button
                            onClick={handleVerifyOTP}
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                        >
                            {
                                loading
                                    ? "Verifying..."
                                    : "Verify OTP"
                            }
                        </button>
                    </>
                )}

            </div>

        </div>
    );
}