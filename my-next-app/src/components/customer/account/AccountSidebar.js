"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Heart, MapPin, CreditCard, Bell, Lock, LogOut } from "lucide-react";
import { logout } from "@/utils/session";

const menus = [
  { name: "Dashboard", href: "/account", icon: LayoutDashboard },
  { name: "My Orders", href: "/account/MyOreder", icon: ShoppingBag },
  { name: "Wishlist", href: "/account/wishlist", icon: Heart },
  { name: "Saved Addresses", href: "/account/addresses", icon: MapPin },
  { name: "Payment Methods", href: "/account/payments", icon: CreditCard },
  { name: "Notifications", href: "/account/notifications", icon: Bell },
  { name: "Change Password", href: "/account/change-password", icon: Lock }
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-xl shadow border">
      <h2 className="text-xl font-bold border-b p-5">My Account</h2>
      <div className="py-2">
        {menus.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-5 py-3 transition ${active ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}`}>
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
        <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50">
          <LogOut size={20} />         
          Logout
        </button>
      </div>
    </div>
  );
}