"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

export default function VerifyMobile() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [userId, setUserId] = useState("");

  // Load Verification Session
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("verifyUserId");
    if (!storedUserId) {
      toast.error("Verification session expired");
      router.replace("/register");
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  // Countdown Timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Verify OTP
  const handleVerify = async () => {
    if (loading) return;

    const enteredOTP = otp.trim();
    if (enteredOTP.length !== 6) {
      return toast.error("Enter valid OTP");
    }

    setLoading(true);
    try {
      const res = await fetchFromAPI("/otp/verify-mobile", {
        method: "POST",
        body: JSON.stringify({ userId, otp: enteredOTP }),
      });

      toast.success(res.message);
      sessionStorage.removeItem("verifyUserId");
      await refreshUser();
      router.replace("/");
    } catch (err) {
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetchFromAPI("/otp/resend-mobile-otp", {
        method: "POST",
        body: JSON.stringify({ userId }),
      });

      toast.success(res.message);
      setTimer(30);
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black mb-2">
          Verify Mobile Number
        </h2>
        
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the OTP sent to your mobile number
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          placeholder="Enter 6-digit OTP"
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleVerify();
            }
          }}
          className="w-full border border-gray-300 p-3 rounded-lg text-center text-lg tracking-[8px] outline-none text-black focus:border-blue-500"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg mt-5 font-semibold disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center mt-5">
          {timer > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in <span className="font-bold text-black">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-blue-600 hover:underline font-semibold disabled:opacity-50"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}