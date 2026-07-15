"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

// src/app/verify-email/page.js
export default function VerifyEmailPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  // Get UserId from Session
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("verifyUserId");
    if (!storedUserId) {
      toast.error("Verification session expired");
      router.replace("/register");
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  // Resend Timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Verify OTP
  const handleVerify = async (otpValue = otp) => {
    if (loading) return;

    const enteredOTP = otpValue.trim();
    if (enteredOTP.length !== 6) {
      return toast.error("Enter valid OTP");
    }

    try {
      setLoading(true);
      const res = await fetchFromAPI("/otp/verify-email", {
        method: "POST",
        body: JSON.stringify({ userId, otp: enteredOTP })
      });

      if (!res.success) {
        return toast.error(res.message);
      }

      toast.success(res.message);
      sessionStorage.removeItem("verifyUserId");
      await refreshUser();
      router.replace("/");
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const res = await fetchFromAPI("/otp/resend-email-otp", {
        method: "POST",
        body: JSON.stringify({ userId })
      });

      if (!res.success) {
        return toast.error(res.message);
      }

      toast.success(res.message);
      setTimer(30);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-black mb-2">
          Verify Email
        </h1>
        
        <p className="text-center text-gray-500 mb-6">
          Enter the 6-digit OTP sent to your email.
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          placeholder="Enter OTP"
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setOtp(value);
            if (value.length === 6) {
              handleVerify(value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleVerify();
            }
          }}
          className="w-full border rounded-lg p-3 text-center text-xl tracking-[8px] outline-none text-black"
        />

        <button
          onClick={() => handleVerify()}
          disabled={loading}
          className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transitions"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center mt-6">
          {timer > 0 ? (
            <p className="text-gray-500">Resend OTP in {timer}s</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-blue-600 hover:underline font-semibold"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}