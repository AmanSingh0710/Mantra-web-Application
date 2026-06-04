"use client";
import { getUser, getImageUrl } from "@/utils/api";
import { FaBell, FaSearch } from "react-icons/fa";

export default function DeliveryTopbar() {
  const user = getUser();

  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm rounded-2xl px-6 py-3 flex items-center justify-between">
      {/* Search - Amazon Style */}
      <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 w-72">
        <FaSearch className="text-gray-400 text-sm" />
        <input 
          type="text" 
          placeholder="Search orders..." 
          className="bg-transparent border-none focus:outline-none text-sm ml-3 w-full"
        />
      </div>

      <div className="flex items-center gap-5 ml-auto">
        {/* Notifications */}
        <button className="relative p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
          <FaBell className="text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">
              {user?.firstName || "Delivery"} {user?.lastName || "Partner"}
            </p>
            <p className="text-[11px] font-bold text-green-500 uppercase mt-1 tracking-wider">
              {user?.status || "Active"}
            </p>
          </div>
          <img 
            src={getImageUrl(user?.deliveryman_image)} 
            className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm"
            alt="Avatar"
          />
        </div>
      </div>
    </div>
  );
}