"use client";

import { fetchFromAPI } from "@/utils/api";
import { useState, useRef, useEffect } from "react";
import useVisitor from "@/utils/useVisitor";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import "react-phone-input-2/lib/style.css";
import {
  FaBell, FaShoppingCart, FaGlobe, FaSearch, FaBars,
  FaCog, FaSignOutAlt, FaChevronDown, FaCheck, FaUser, FaLock, FaCamera, FaEye, FaEyeSlash, FaSpinner
} from "react-icons/fa";




export default function AdminNavbar({ data, toggleSidebar, activeTab, setActiveTab }) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { onlineUsers, stats } = useVisitor();
  const profileRef = useRef(null);
  const langRef = useRef(null);

  const languageFlags = {
    English: "/en.png",
    Hindi: "/hi.png",
    Spanish: "/es.png",
    French: "/fr.png",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#f59e0b",
      confirmButtonText: "Yes, logout!"
    });

    if (result.isConfirmed) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/login");
    }
  };



  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-3 md:px-4 sticky top-0 z-50 w-full shadow-sm">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-lg">
          <FaBars size={20} />
        </button>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <input type="text" placeholder="Search anything..." className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1 p-1.5 sm:p-2 hover:bg-gray-100 rounded-md transition border border-transparent">
            <Image src={languageFlags[data?.language] || "/en.png"} alt="Lang" width={18} height={12} className="rounded-sm" />
            <span className="hidden sm:block text-xs font-medium text-gray-700">{data?.language || "English"}</span>
            <FaChevronDown size={8} className="text-gray-400" />
          </button>
          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50">
              {Object.keys(languageFlags).map((lang) => (
                <button key={lang} onClick={() => setIsLangOpen(false)} className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-700 hover:bg-amber-50 transition">
                  <div className="flex items-center gap-2"><Image src={languageFlags[lang]} alt={lang} width={16} height={10} /> {lang}</div>
                  {(data?.language || "English") === lang && <FaCheck size={8} className="text-amber-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">

          {/* 🔴 Live Users */}
          <div className="flex items-center gap-1 text-green-600 font-semibold text-xs">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            Live: {onlineUsers}
          </div>

          {/* Divider */}
          <div className="h-4 w-[1px] bg-gray-300"></div>

          {/* 📊 Today Visitors */}
          <div className="text-gray-700 text-xs font-medium">
            Today: {stats.todayVisitors}
          </div>

        </div>

        <button onClick={() => router.push("/")} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"><FaGlobe size={18} /></button>

        <button onClick={() => setActiveTab("notifications")} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative transition">
          <FaBell size={18} />
          {data?.notifications > 0 && <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] px-1 rounded-full border border-white">{data.notifications}</span>}
        </button>

        <button onClick={() => setActiveTab("orders_pending")} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative transition">
          <FaShoppingCart size={18} />
          {data?.pendingOrders > 0 && <span className="absolute top-1 right-1 bg-amber-600 text-white text-[8px] px-1 rounded-full border border-white">{data.pendingOrders}</span>}
        </button>

        <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden xs:block"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 md:gap-3 pl-1 cursor-pointer group">
            <div className="text-right hidden lg:block leading-none">
              <p className="text-sm font-bold text-gray-800 group-hover:text-amber-600 transition">{data?.admin?.name || "Lebrostone"}</p>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Master Admin</span>
            </div>
            <div className="relative h-9 w-9 border-2 border-amber-100 rounded-full overflow-hidden shadow-sm group-hover:border-amber-400 transition">
              <Image src={data?.admin?.avatar || "/Lebrostone logo.png"} alt="Admin" fill className="object-cover" />
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <button onClick={() => { setActiveTab("settings"); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition">
                <FaCog className="text-gray-400" /> Settings
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-50 mt-1 transition">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}