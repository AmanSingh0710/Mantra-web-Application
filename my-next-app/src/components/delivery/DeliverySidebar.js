"use client";
//src/components/delivery/DeliverySidebar.js
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Wallet,
  MapPinned,
  UserCircle2,
  LogOut,
  Bike,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/delivery",
    icon: LayoutDashboard,
  },

  {
    name: "My Orders",
    href: "/deliveryBoy/orders",
    icon: Package,
  },

  {
    name: "Live Tracking",
    href: "/deliveryBoy/tracking",
    icon: MapPinned,
  },

  {
    name: "Wallet & Earnings",
    href: "/deliveryBoy/earnings",
    icon: Wallet,
  },

  {
    name: "Profile",
    href: "/deliveryBoy/profile",
    icon: UserCircle2,
  },
];

export default function DeliverySidebar() {
  return (
    <div className="w-[290px] min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-white flex flex-col justify-between border-r border-zinc-800">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="px-7 py-8 border-b border-zinc-800">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center shadow-2xl shadow-orange-500/30">

              <Bike size={28} />

            </div>

            <div>

              <h1 className="text-2xl font-black tracking-tight">
                Delivery Hub
              </h1>

              <p className="text-sm text-zinc-400 font-medium">
                Delivery Management
              </p>

            </div>

          </div>

        </div>

        {/* MENUS */}
        <div className="p-5 flex flex-col gap-3">

          {menus.map((menu) => {

            const Icon = menu.icon;

            return (
              <Link
                key={menu.name}
                href={menu.href}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  px-5
                  py-4
                  rounded-2xl
                  bg-zinc-900/70
                  hover:bg-gradient-to-r
                  hover:from-orange-500
                  hover:to-yellow-400
                  transition-all
                  duration-300
                  hover:shadow-xl
                  hover:shadow-orange-500/20
                "
              >

                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-zinc-800
                    group-hover:bg-white/20
                    flex
                    items-center
                    justify-center
                    transition-all
                  "
                >
                  <Icon size={20} />
                </div>

                <div>

                  <p className="font-bold text-[15px]">
                    {menu.name}
                  </p>

                  <p className="text-xs text-zinc-400 group-hover:text-white/80">
                    Manage {menu.name}
                  </p>

                </div>

              </Link>
            );
          })}

        </div>

      </div>

      {/* BOTTOM */}
      <div className="p-5 border-t border-zinc-800">

        <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl  bg-red-500/10  hover:bg-red-500 transition-all duration-300 font-bold  text-red-400  hover:text-white"
        >

          <LogOut size={20} />
          Logout

        </button>

      </div>

    </div>
  );
}