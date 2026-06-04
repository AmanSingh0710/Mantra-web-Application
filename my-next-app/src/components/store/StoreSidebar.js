"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaThLarge, FaBoxOpen, FaPlusCircle, FaShoppingCart, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { logoutUser } from "@/utils/api";

export default function StoreSidebar() {
  const path = usePathname();

  const menu = [
    { name: "Dashboard", path: "/store", icon: <FaThLarge /> },
    { name: "Products", path: "/store/products", icon: <FaBoxOpen /> },
    { name: "Add Product", path: "/store/add-store", icon: <FaPlusCircle /> },
    { name: "Orders", path: "/store/orders", icon: <FaShoppingCart /> },
    { name: "Analytics", path: "/store/analytics", icon: <FaChartBar /> },
    { name: "Settings", path: "/store/settings", icon: <FaCog /> },
  ];

  return (
    <aside className="w-[280px] fixed inset-y-0 left-0 bg-white border-r border-gray-100 shadow-sm flex flex-col hidden lg:flex">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
          <h1 className="text-xl font-black tracking-tighter text-gray-900 uppercase">Vendor Hub</h1>
        </div>

        <nav className="space-y-1.5">
          {menu.map((m) => {
            const isActive = path === m.path;
            return (
              <Link
                key={m.path}
                href={m.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isActive 
                  ? "bg-black text-white shadow-lg shadow-gray-200 translate-x-1" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-lg">{m.icon}</span>
                {m.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8">
        <button 
          onClick={logoutUser}
          className="flex items-center gap-4 px-4 py-3.5 w-full rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
        >
          <FaSignOutAlt className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
}