"use client";

import useVisitor from "@/utils/useVisitor";
import { FaUsers, FaChartBar, FaCalendarDay } from "react-icons/fa";

export default function VisitorStats() {
  // Safe extraction with default fallbacks to prevent crash during initial load
  const { onlineUsers = 0, stats = {} } = useVisitor() || {};
  
  const totalVisitors = stats?.total ?? 0;
  const todayVisitors = stats?.todayVisitors ?? 0;

  return (
    <section className="w-full bg-gray-50 border-t border-b border-gray-200/80 py-6 px-4 select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Industry Responsive Grid Structure */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          
          {/* CARD 1: LIVE ONLINE USERS (With Pulsing Live Indicator) */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="relative p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <FaUsers className="text-xl md:text-2xl" />
              {/* Ping Active Animation Layer */}
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Live Users</p>
              <h4 className="text-lg md:text-xl font-black text-gray-900 tracking-tight mt-0.5">
                {Number(onlineUsers).toLocaleString()}
              </h4>
            </div>
          </div>

          {/* CARD 2: TOTAL VISITORS */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
              <FaChartBar className="text-xl md:text-2xl" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Traffic</p>
              <h4 className="text-lg md:text-xl font-black text-gray-900 tracking-tight mt-0.5">
                {Number(totalVisitors).toLocaleString()}
              </h4>
            </div>
          </div>

          {/* CARD 3: TODAY VISITORS */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <FaCalendarDay className="text-xl md:text-2xl" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Today's Sessions</p>
              <h4 className="text-lg md:text-xl font-black text-gray-900 tracking-tight mt-0.5">
                {Number(todayVisitors).toLocaleString()}
              </h4>
            </div>
          </div>

        </div>
        
        {/* Amazon-style Structural Trust Subtext */}
        <p className="text-center text-[10px] text-gray-400 font-medium mt-4 tracking-wide">
          Real-time metrics certified via platform security metrics pipelines.
        </p>
      </div>
    </section>
  );
}