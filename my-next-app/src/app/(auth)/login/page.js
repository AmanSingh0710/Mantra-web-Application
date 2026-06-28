"use client";
//src/app/login/page.js
import { fetchFromAPI } from "@/utils/api";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaTimes, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage({ isOpen, onClose }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If used as a modal and not open, return nothing
  if (onClose && !isOpen) return null;

  const validate = () => {
    let newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const data = await fetchFromAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // ✅ Success
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.role);

      toast.success(`Welcome back, ${data.user.name}! 🎉`);

      if (onClose) {
        onClose();
        router.refresh();
      } else {
        router.push("/");
      }

    } catch (err) {

      const message = err.message || "";

      // ✅ EMAIL VERIFY
      if (message.includes("verify your email")) {
        toast.error(
          "Please verify your email first 📩"
        );

        router.push("/verify-email");

      }

      // // ✅ MOBILE VERIFY
      // else if (message.includes("verify your mobile")) {

      //   toast.error("Please verify your mobile first 📱");

      //   router.push("/verify-mobile");

      // }

      // ✅ INVALID LOGIN
      else if (message.includes("Invalid credentials")) {
        toast.error("Invalid email or password");
      }

      // ✅ BLOCKED
      else if (message.includes("blocked")) {
        toast.error(
          "Account blocked");
      }

      // ✅ OTHER ERROR
      else {
        toast.error(message || "Login failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${onClose ? "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" : "min-h-screen flex items-center justify-center bg-gray-100 p-4"}`}>

      {/* Modal / Card Container */}
      <div className="relative bg-white w-full max-w-[450px] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Decorative Side Panel (Flipkart Style) */}
        <div className="hidden md:flex w-2/5 bg-[#2874f0] p-8 flex-col justify-between text-white">
          <div>
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="mt-4 text-gray-200 text-sm leading-relaxed">
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
          <img src="/login-graphic-image.jpg" alt="" className="w-full opacity-50" />
        </div>

        {/* Form Section */}
        <div className="flex-1 p-6 sm:p-10 relative">
          {/* Close Button (Only if used as Modal) */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors"
            >
              <FaTimes size={20} />
            </button>
          )}

          <h1 className="text-xl font-bold text-gray-800 mb-6 md:hidden">Login</h1>

          <div className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Email Address</label>
              <div className="flex items-center border-b border-gray-300 focus-within:border-[#2874f0] transition-colors">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full py-2 outline-none bg-transparent text-gray-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] mt-1 font-semibold italic">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Password
              </label>

              <div className="flex items-center border-b border-gray-300 focus-within:border-[#2874f0] transition-colors">
                <FaLock className="text-gray-400 mr-2" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  className="w-full py-2 outline-none bg-transparent text-gray-800"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-[#2874f0] transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-[10px] mt-1 font-semibold italic">
                  {errors.password}
                </p>
              )}

              <div className="text-right mt-1">
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#2874f0] font-bold hover:underline"
                >
                  Forgot?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#fb641b] hover:bg-[#f85606] text-white font-bold py-3 rounded shadow-lg shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "AUTHENTICATING..." : "LOGIN"}
            </button>

            <div className="flex items-center my-5">
              <div className="flex-1 h-[1px] bg-gray-300"></div>

              <span className="px-3 text-xs text-gray-400 font-semibold">
                OR
              </span>

              <div className="flex-1 h-[1px] bg-gray-300"></div>
            </div>

            {/* OTP Login Button */}
            <Link
              href="/login-otp"
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded shadow-lg transition-all active:scale-[0.98]"
            >
              LOGIN WITH OTP
            </Link>

            {/* Bottom Links */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                New to our platform?{" "}
                <Link href="/register" className="text-[#2874f0] font-bold hover:underline">
                  Create an account
                </Link>
              </p>

              <p className="text-[9px] text-gray-400 mt-8 leading-tight">
                By continuing, you agree to Lebrostone's Terms of Use and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}