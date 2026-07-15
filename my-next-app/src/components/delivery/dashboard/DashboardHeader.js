"use client";
import { RefreshCw, CalendarDays } from "lucide-react";

export default function DashboardHeader({ refreshing, onRefresh }) {
  const date = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6 w-full overflow-hidden">
      {/* 
        Changes from flex-col to sm:flex-row to break layout early on small screens.
        Items drop into place cleanly with appropriate vertical padding adjustments.
      */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-5">
        
        {/* Typography container adapting font sizes systematically */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Delivery Dashboard
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-0.5 sm:mt-1">
            Welcome Back 👋
          </p>
        </div>

        {/* 
          Control buttons structure:
          Stacks stacked rows on small screen frames, shifts to uniform horizontal blocks on desktop
        */}
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto">
          
          {/* Date Indicator Badge */}
          <div className="flex items-center justify-center sm:justify-start gap-2 bg-gray-100 px-3 sm:px-4 py-2 rounded-xl text-gray-600 w-full sm:w-auto">
            <CalendarDays size={18} className="flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
              {date}
            </span>
          </div>

          {/* Refresh Action Trigger */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 sm:px-5 py-2 rounded-xl transition font-medium text-sm sm:text-base active:scale-[0.98] w-full sm:w-auto"
          >
            <RefreshCw
              size={18}
              className={`flex-shrink-0 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>

        </div>

      </div>
    </div>
  );
}