"use client";

import { fetchFromAPI } from "@/utils/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaHashtag } from "react-icons/fa";

export default function RegisterPage({ isOpen, onClose }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    address: "",
    pin: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // If used as a modal and not open, return nothing
  if (onClose && !isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email || !/^\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email required";
    if (!form.address) newErrors.address = "Address is required";
    if (!/^[0-9]{6}$/.test(form.pin)) newErrors.pin = "Enter 6-digit PIN";
    if (!/^[0-9]{10}$/.test(form.mobile)) newErrors.mobile = "Enter 10-digit Mobile";
    // FIXED THIS LINE: Changed 'password' to 'form.password'
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {

    if (loading) return;

    if (!validate()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);

    try {

      // ✅ API call
      const data = await fetchFromAPI("/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            mobile: form.mobile.trim(),
            password: form.password,
            address: form.address.trim(),
            pin: form.pin.trim(),
          }),
        }
      );


      toast.success(data.message || "Account created successfully");

      sessionStorage.setItem("verifyUserId",data.userId);

      router.replace("/verify-email");

    } catch (err) {
      console.error("REGISTER ERROR:", err);
      toast.error(err.message || "Registration failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className={`${onClose ? "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" : "min-h-screen flex items-center justify-center bg-gray-100 p-4"}`}>

      {/* Container */}
      <div className="relative bg-white w-full max-w-[700px] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Decorative Side Panel (Flipkart Blue Style) */}
        <div className="hidden md:flex w-1/3 bg-[#2874f0] p-8 flex-col justify-between text-white">
          <div>
            <h2 className="text-2xl font-bold">Looks like you're new here!</h2>
            <p className="mt-4 text-gray-100 text-sm leading-relaxed">
              Sign up with your mobile number to get started.
            </p>
          </div>
          <div className="text-4xl font-bold opacity-20">MANTRA</div>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-6 sm:p-10 relative bg-white">
          {onClose && (
            <button onClick={onClose} className="absolute right-4 top-4 text-gray-700 hover:text-black transition-colors">
              <FaTimes size={20} />
            </button>
          )}

          <h1 className="text-xl font-bold text-gray-800 mb-6">Create Account</h1>

          {/* Grid for two-column layout on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

            {/* Name */}
            <div className="relative border-b text-black border-gray-300 focus-within:border-[#2874f0]">
              <label className="text-[15px] uppercase font-bold text-gray-700">Full Name</label>
              <div className="flex items-center">
                <FaUser className="text-gray-400 mr-2 text-xs" />
                <input type="text" name="name" placeholder="John Doe" className="w-full py-1 outline-none text-sm" value={form.name} onChange={handleChange} />
              </div>
              {errors.name && <p className="text-red-500 text-[9px] font-bold uppercase">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="relative border-b text-black border-gray-300 focus-within:border-[#2874f0]">
              <label className="text-[15px] uppercase font-bold text-gray-700">Email Address</label>
              <div className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-2 text-xs" />
                <input type="email" name="email" placeholder="example@mail.com" className="w-full py-1 outline-none text-sm" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value.toLowerCase() }); }} />
              </div>
              {errors.email && <p className="text-red-500 text-[9px] font-bold uppercase">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div className="relative border-b text-black border-gray-300 focus-within:border-[#2874f0]">
              <label className="text-[15px] uppercase font-bold text-gray-700">Mobile Number</label>
              <div className="flex items-center">
                <FaPhone className="text-gray-400 mr-2 text-xs" />
                <input type="text" name="mobile" inputMode="numeric" maxLength={10} value={form.mobile} onChange={(e) => { const value = e.target.value.replace(/\D/g, ""); setForm({ ...form, mobile: value }); }} placeholder="10-digit number" className="w-full py-1 outline-none text-sm" />
              </div>
              {errors.mobile && <p className="text-red-500 text-[9px] font-bold uppercase">{errors.mobile}</p>}
            </div>

            {/* Password */}
            <div className="relative border-b text-black border-gray-300 focus-within:border-[#2874f0]">
              <label className="text-[15px] uppercase font-bold text-gray-700">Set Password</label>
              <div className="flex items-center">
                <FaLock className="text-gray-400 mr-2 text-xs" />
                <input type="password" name="password" placeholder="10 characters" className="w-full py-1 outline-none text-sm" value={form.password} onChange={handleChange} />
              </div>
              {errors.password && <p className="text-red-500 text-[9px] font-bold uppercase">{errors.password}</p>}
            </div>

            {/* Address - Full width */}
            <div className="relative border-b text-black border-gray-300 focus-within:border-[#2874f0] md:col-span-2">
              <label className="text-[15px] uppercase font-bold text-gray-700">Delivery Address</label>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-gray-400 mr-2 text-xs" />
                <input type="text" name="address" placeholder="House No, Street, Area" className="w-full py-1 outline-none text-sm" value={form.address} onChange={handleChange} />
              </div>
              {errors.address && <p className="text-red-500 text-[9px] font-bold uppercase">{errors.address}</p>}
            </div>

            {/* PIN Code */}
            <div className="relative border-b text-black border-gray-300 focus-within:border-[#2874f0]">
              <label className="text-[15px] uppercase font-bold text-gray-700">PIN Code</label>
              <div className="flex items-center">
                <FaHashtag className="text-gray-400 mr-2 text-xs" />
                <input type="text" name="pin" inputMode="numeric" maxLength={6} placeholder="6 digits" className="w-full py-1 outline-none text-sm" value={form.pin} onChange={(e) => { const value = e.target.value.replace(/\D/g, ""); setForm({ ...form, pin: value }); }} />
              </div>
              {errors.pin && <p className="text-red-500 text-[9px] font-bold uppercase">{errors.pin}</p>}
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-[#fb641b] hover:bg-[#f85606] text-white font-bold py-3 rounded shadow-lg mt-8 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "CREATING ACCOUNT..." : "CONTINUE"}
          </button>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 font-medium">
              Existing User? <span className="text-[#2874f0] cursor-pointer font-bold hover:underline" onClick={() => router.push('/login')}>Log in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}