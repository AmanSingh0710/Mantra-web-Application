"use client";
import { FaBell, FaSearch } from "react-icons/fa";
import {getImageUrl } from "@/utils/api";
import { getUser} from "@/utils/auth";

export default function StoreTopbar() {
  const user = getUser();

  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      
      {/* Title Section - Hidden on tiny screens to save space */}
      <div className="hidden md:block">
        <h1 className="text-xl font-black text-gray-900 leading-none">
          {user?.shopName || "Store Dashboard"}
        </h1>
        <p className="text-[11px] font-bold text-green-500 uppercase mt-1 tracking-wider">
          Vendor Portal • {user?.status || "Active"}
        </p>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 sm:gap-5 ml-auto">
        {/* Search - Icon only on mobile */}
        <button className="p-2.5 bg-gray-50 rounded-xl lg:hidden">
          <FaSearch className="text-gray-400" />
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
          <FaBell className="text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Group */}
        <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase">Store Admin</p>
          </div>
          <img 
            src={getImageUrl(user?.vendorImage)} 
            alt="Admin"
            className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}