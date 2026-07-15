"use client";

import { useState } from "react";
import DeliverySidebar from "@/components/delivery/layout/DeliverySidebar";
import DeliveryNavbar from "@/components/delivery/layout/DeliveryNavbar";
import DeliveryFooter from "@/components/delivery/layout/DeliveryFooter";
import { Toaster } from "react-hot-toast";

export default function DeliveryLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Navbar - Fixed at the top */}
      <DeliveryNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Page Layout Wrapper */}
      <div className="flex flex-1 pt-20 relative">
        
        {/* Sidebar wrapper targeting mobile vs desktop offsets */}
        <DeliverySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-72">
          <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto">
            {children}
          </main>

          {/* Footer attached at the bottom of content wrapper */}
          <DeliveryFooter />
        </div>

      </div>
    </div>
  );
}