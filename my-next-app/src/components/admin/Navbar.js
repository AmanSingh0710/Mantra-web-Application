"use client";

import { fetchFromAPI } from "@/utils/api";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { 
  FaBell, 
  FaShoppingCart, 
  FaGlobe, 
  FaSearch, 
  FaBars, 
  FaCog, 
  FaSignOutAlt, 
  FaChevronDown, 
  FaCheck 
} from "react-icons/fa";

export default function AdminNavbar({ toggleSidebar, setActiveTab }) {
  const router = useRouter();
  const profileRef = useRef(null);
  const langRef = useRef(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [navbarData, setNavbarData] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English", flag: "/flags/en.png" },
    { code: "hi", name: "हिन्दी", flag: "/flags/in.png" },
    { code: "fr", name: "Français", flag: "/flags/fr.png" },
    { code: "es", name: "Español", flag: "/flags/es.png" }
  ];

  const currentLanguage = languages.find(item => item.code === selectedLanguage) || languages[0];

  const loadNavbar = async () => {
    try {
      const res = await fetchFromAPI("/admin/navbar");
      if (res.success) {
        setNavbarData(res);
      }
    } catch (err) {
      console.error("Failed to fetch navbar data:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    loadNavbar();
    const interval = setInterval(loadNavbar, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (navbarData?.language) {
      setSelectedLanguage(navbarData.language);
    }
  }, [navbarData]);

  const changeLanguage = async (lang) => {
    try {
      const res = await fetchFromAPI("/admin/language", {
        method: "PATCH",
        body: JSON.stringify({ language: lang.code })
      });

      if (res.success) {
        setSelectedLanguage(lang.code);
        setNavbarData(prev => ({
          ...prev,
          admin: {
            ...prev?.admin,
            language: lang.code
          }
        }));
      }
    } catch (error) {
      console.error("Language switch error:", error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      setActiveTab(`search:${search.trim()}`);
    }
  };

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
      try {
        await fetchFromAPI("/auth/logout", { method: "POST" });
        router.push("/login");
      } catch (err) {
        console.error("Logout failed:", err);
      }
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-3 md:px-4 sticky top-0 z-50 w-full shadow-sm">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition">
          <FaBars size={20} />
        </button>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            onKeyDown={handleSearch} 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" 
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1 p-1.5 sm:p-2 hover:bg-gray-100 rounded-md transition border border-transparent">
            <Image
              src={currentLanguage.flag}
              alt={currentLanguage.name}
              width={18}
              height={12}
              className="rounded-sm"
            />
            <span className="hidden sm:block text-xs font-medium text-gray-700">{currentLanguage.name}</span>
            <FaChevronDown size={8} className="text-gray-400" />
          </button>
          
          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang);
                    setIsLangOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-700 hover:bg-amber-50 transition"
                >
                  <div className="flex items-center gap-2">
                    <Image src={lang.flag} alt={lang.name} width={16} height={10} />
                    {lang.name}
                  </div>
                  {selectedLanguage === lang.code && <FaCheck size={8} className="text-amber-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Real-time Counter Stats */}
        <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
          <div className="flex items-center gap-1 text-green-600 font-semibold text-xs">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            Live: {navbarData?.onlineUsers || 0}
          </div>
          <div className="h-4 w-[1px] bg-gray-300"></div>
          <div className="text-gray-700 text-xs font-medium">
            Today: {navbarData?.stats?.todayVisitors || 0}
          </div>
        </div>

        <button onClick={() => router.push("/")} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
          <FaGlobe size={18} />
        </button>

        <button onClick={() => setActiveTab("notifications")} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative transition">
          <FaBell size={18} />
          {navbarData?.notifications > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] px-1 rounded-full border border-white">
              {navbarData.notifications}
            </span>
          )}
        </button>

        <button onClick={() => setActiveTab("orders_pending")} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative transition">
          <FaShoppingCart size={18} />
          {navbarData?.pendingOrders > 0 && (
            <span className="absolute top-1 right-1 bg-amber-600 text-white text-[8px] px-1 rounded-full border border-white">
              {navbarData.pendingOrders}
            </span>
          )}
        </button>

        <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden xs:block"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 md:gap-3 pl-1 cursor-pointer group">
            <div className="text-right hidden lg:block leading-none">
              <p className="text-sm font-bold text-gray-800 group-hover:text-amber-600 transition">
                {navbarData?.admin?.name || "Loading..."}
              </p>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Master Admin</span>
            </div>
            <div className="relative h-9 w-9 border-2 border-amber-100 rounded-full overflow-hidden shadow-sm group-hover:border-amber-400 transition">
              <img
                src={navbarData?.admin?.image || "/default-avatar.png"}
                alt={navbarData?.admin?.name || "Admin Profile"}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <button 
                onClick={() => { setActiveTab("settings"); setIsProfileOpen(false); }} 
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition"
              >
                <FaCog className="text-gray-400" /> Settings
              </button>
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-50 mt-1 transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}