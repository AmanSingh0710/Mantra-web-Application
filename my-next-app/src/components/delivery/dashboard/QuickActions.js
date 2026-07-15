"use client";
import Link from "next/link";
import { Package, MapPinned, Wallet, User, ArrowRight } from "lucide-react";

const actions = [
  {
    title: "Assigned Orders",
    icon: Package,
    link: "/delivery/orders"
  },
  {
    title: "Tracking",
    icon: MapPinned,
    link: "/delivery/tracking"
  },
  {
    title: "Wallet",
    icon: Wallet,
    link: "/delivery/wallet"
  },
  {
    title: "Profile",
    icon: User,
    link: "/delivery/profile"
  }
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 w-full overflow-hidden">
      <h2 className="font-bold text-base sm:text-lg mb-4 text-gray-800">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.link}
              className="group border rounded-xl p-4 sm:p-5 bg-gray-50/30 hover:bg-blue-50/60 border-gray-100 hover:border-blue-200 transition-all duration-200 flex flex-col justify-between min-w-0"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="p-2 bg-white rounded-lg border border-gray-100 group-hover:border-blue-100 text-blue-600 shadow-sm transition-colors">
                  <Icon size={20} className="flex-shrink-0" />
                </div>
                <ArrowRight 
                  size={16} 
                  className="text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-0.5 transition-all flex-shrink-0" 
                />
              </div>
              
              <h3 className="mt-4 text-sm sm:text-base font-semibold text-gray-700 group-hover:text-blue-700 transition-colors truncate">
                {item.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}