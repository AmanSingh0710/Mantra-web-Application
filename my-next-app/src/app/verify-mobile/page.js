"use client";

import { useState, useEffect } from "react";
import { fetchFromAPI } from "@/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function VerifyMobile() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ resend timer
  const [timer, setTimer] = useState(30);

  // ✅ userId from localStorage
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("verifyUserId")
      : null;

  // ⏳ countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ✅ VERIFY MOBILE OTP
  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      return toast.error("Enter valid 6-digit OTP");
    }

    setLoading(true);

    try {
      const res = await fetchFromAPI("/otp/verify-mobile", {
        method: "POST",
        body: JSON.stringify({
          userId,
          otp,
        }),
      });

      toast.success(res.message || "Mobile verified successfully ✅");

      // ✅ update local user
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser) {
        storedUser.isMobileVerified = true;
        localStorage.setItem(
          "user",
          JSON.stringify(storedUser)
        );
      }

      // ✅ redirect home
      router.push("/");

    } catch (err) {
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 RESEND OTP
  const handleResend = async () => {
    try {
      await fetchFromAPI("/otp/resend-mobile-otp", {
        method: "POST",
        body: JSON.stringify({
          userId,
        }),
      });

      toast.success("OTP sent again 📩");

      // ✅ restart timer
      setTimer(30);

    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
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

        {/* OTP INPUT */}
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          className="w-full border border-gray-300 p-3 rounded-lg text-center text-lg tracking-[8px] outline-none text-black focus:border-blue-500"
        />

        {/* VERIFY BUTTON */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg mt-5 font-semibold disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* RESEND */}
        <div className="text-center mt-5">

          {timer > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in{" "}
              <span className="font-bold text-black">
                {timer}s
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
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