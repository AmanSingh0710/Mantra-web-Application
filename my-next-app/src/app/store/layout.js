"use client";
import StoreSidebar from "@/components/store/StoreSidebar";

export default function StoreLayout({ children }) {
  return (
    <div className="flex bg-[#F8F9FA] min-h-screen font-sans">
      {/* Sidebar hidden on mobile, fixed width on desktop */}
      <StoreSidebar />

      <div className="flex-1 lg:ml-[280px] min-w-0 transition-all duration-300">
        <main className="p-4 md:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}