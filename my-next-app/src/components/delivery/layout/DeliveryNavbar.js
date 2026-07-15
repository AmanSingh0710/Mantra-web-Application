"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Menu, Search, Bell, ChevronDown, Power, User, Settings, Wallet, LogOut } from "lucide-react";

import { fetchFromAPI,getImageUrl } from "@/utils/api";
import { logout } from "@/utils/session";

export default function DeliveryNavbar({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();

  // ==========================
  // STATES & REFS
  // ==========================
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // ==========================
  // LOAD DATA
  // ==========================
  useEffect(() => {
    loadProfile();
    loadNotifications();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetchFromAPI("/deliveryBoy/my-profile");
      setProfile(res);
      setIsOnline(res?.status === "ONLINE");
    } catch (error) {
      console.error("Profile load error:", error);
    } finally {
      loadLoadingStatus();
    }
  };

  const loadLoadingStatus = () => {
    setLoading(false);
  };

  const loadNotifications = async () => {
    try {
      const res = await fetchFromAPI("/deliveryBoy/notification/delivery");
      setNotifications(
        Array.isArray(res?.notifications)
          ? res.notifications
          : []
      );
    } catch (err) {
      console.error("Notification load error:", err);
      setNotifications([]);
    }
  };

  // ==========================
  // ONLINE / OFFLINE TOGGLE
  // ==========================
  const toggleStatus = async () => {
    try {
      const res = await fetchFromAPI("/deliveryBoy/toggle-status", {
        method: "PUT",
      });
      setIsOnline(res?.status === "ONLINE");
      toast.success(`You are now ${res?.status || "Updated"}`);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  // ==========================
  // CLOSE DROPDOWNS ON CLICK OUTSIDE
  // ==========================
  useEffect(() => {
    const closeDropdowns = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    window.addEventListener("click", closeDropdowns);
    return () => window.removeEventListener("click", closeDropdowns);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm w-full">
      {/* Dynamic inline container padding scaling on smaller phone boundaries */}
      <div className="flex items-center justify-between h-16 px-3 sm:px-6 gap-2 sm:gap-4 w-full">
        
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
          >
            <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />
          </button>

          <div className="min-w-0">
            {/* Title folds sizing tags cleanly on mobile layers */}
            <h2 className="text-base sm:text-xl font-bold text-gray-800 truncate">
              Delivery Dashboard
            </h2>
            {!loading && profile && (
              <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                <span className="hidden xs:inline">Welcome back, </span>
                <span className="font-semibold">{profile?.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Center Section (Search Bar - Responsive Hidden Breakpoints) */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-200 pl-11 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
        </div>

        {/* Right Action Section */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          
          {/* Status Toggle - Condensed Iconography display on mobile targets */}
          <button
            onClick={toggleStatus}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition active:scale-[0.97] ${
              isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}
          >
            <Power size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">{isOnline ? "Online" : "Offline"}</span>
          </button>

          {/* Notifications Dropdown Container */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 block transition-colors"
            >
              <Bell size={20} className="sm:w-[22px] sm:h-[22px] text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 sm:-top-0.5 sm:-right-0.5 bg-red-500 text-white text-[9px] sm:text-[11px] h-4 w-4 sm:h-5 sm:w-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification List Dropdown (Responsive right placement mapping) */}
            {notificationOpen && (
              <div className="absolute right-[-60px] xs:right-0 mt-3 w-72 sm:w-80 bg-white rounded-xl shadow-xl border overflow-hidden py-2 z-50">
                <div className="px-4 py-2 border-b font-semibold text-gray-700 text-sm">Notifications</div>
                <div className="max-h-64 overflow-y-auto generic-scrollbar">
                  {notifications.length === 0 ? (
                    <p className="text-center text-gray-400 py-6 text-sm">No new notifications</p>
                  ) : (
                    notifications.map((notif, index) => (
                      <div key={notif.id || index} className="px-4 py-3 hover:bg-gray-50 border-b last:border-0 transition text-sm">
                        <p className="text-gray-800 font-medium">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Wallet Balance Display (Hidden automatically on dense base phone panels) */}
          <div className="hidden sm:flex items-center gap-2 bg-green-50/70 px-3 py-1.5 rounded-xl border border-green-100/30">
            <Wallet size={16} className="text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-medium leading-none">Wallet</p>
              <p className="font-bold text-green-700 text-xs sm:text-sm mt-0.5 leading-tight">
                ₹{profile?.walletBalance || 0}
              </p>
            </div>
          </div>

          {/* Profile Dropdown Container */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1 sm:gap-2 focus:outline-none group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border border-gray-100 overflow-hidden shadow-sm flex-shrink-0 transition-transform group-active:scale-95">
                {profile?.image ? (
                  <img
                    src={getImageUrl(profile?.image)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile?.name?.charAt(0).toUpperCase() || "D"
                )}
              </div>

              <div className="hidden lg:block text-left max-w-[100px]">
                <h4 className="font-semibold text-gray-700 text-sm leading-tight truncate">
                  {profile?.name || "Delivery Partner"}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Active</p>
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Profile Dropdown Options */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-48 sm:w-56 bg-white rounded-xl shadow-xl border overflow-hidden py-1 z-50">
                
                {/* Visual context info item displayed natively on mobile views */}
                <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 block lg:hidden max-w-full">
                  <p className="font-semibold text-gray-800 text-xs truncate">{profile?.name || "Delivery Partner"}</p>
                  <p className="text-[10px] text-green-600 font-medium mt-0.5">Wallet: ₹{profile?.walletBalance || 0}</p>
                </div>

                <Link
                  href="/delivery/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <User size={16} className="text-gray-400" />
                  My Profile
                </Link>

                <Link
                  href="/delivery/settings"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <Settings size={16} className="text-gray-400" />
                  Settings
                </Link>

                <div className="border-t my-1 border-gray-100" />

                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}