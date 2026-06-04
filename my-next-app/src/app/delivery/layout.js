"use client";

import DeliverySidebar from "@/components/delivery/DeliverySidebar";

export default function DeliveryLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <DeliverySidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}