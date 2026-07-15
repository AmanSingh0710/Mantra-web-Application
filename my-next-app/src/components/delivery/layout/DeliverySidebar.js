"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { fetchFromAPI } from "@/utils/api";
import logout  from "@/utils/session";
import toast from "react-hot-toast";
import { LayoutDashboard, Package, Truck, Wallet, IndianRupee, Bell, User, Settings, LogOut, ChevronDown, ChevronLeft, ChevronRight, Circle, X } from "lucide-react";

export default function DeliverySidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const sidebar = localStorage.getItem("delivery_sidebar");
    if (sidebar) {
      setCollapsed(JSON.parse(sidebar));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("delivery_sidebar", JSON.stringify(collapsed));
  }, [collapsed]);

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetchFromAPI("/deliveryBoy/my-profile");
      const profile = res.data || res;
      setDeliveryBoy(profile);
      setIsOnline(profile?.isOnline || false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await fetchFromAPI("/notifications/user/unread-count");
      setNotificationCount(res.data?.count || res.count || 0);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const refreshSidebar = useCallback(async () => {
    try {
      setRefreshing(true);
      await Promise.all([loadProfile(), loadNotifications()]);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [loadProfile, loadNotifications]);

  useEffect(() => {
    refreshSidebar();
  }, [refreshSidebar]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshSidebar();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshSidebar]);

  const isActive = useCallback((href) => {
    if (!href) return false;
    if (pathname === href) return true;
    return pathname.startsWith(href + "/");
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/deliveryBoy/orders")) {
      setOrdersOpen(true);
    }
  }, [pathname]);

  const menus = useMemo(() => [
    { id: "dashboard", title: "Dashboard", icon: LayoutDashboard, href: "/delivery" },
    {
      id: "orders",
      title: "Orders",
      icon: Package,
      children: [
        { title: "Assigned Orders", href: "/delivery/orders/assigned" },
        { title: "All Orders", href: "/delivery/orders" },
        { title: "Active Orders", href: "/delivery/orders/active" },
        { title: "Completed Orders", href: "/delivery/orders/completed" },
        { title: "Cancelled Orders", href: "/delivery/orders/cancelled" },
        { title: "Returned Orders", href: "/delivery/orders/returned" }
      ]
    },
    { id: "tracking", title: "Tracking", icon: Truck, href: "/delivery/tracking" },
    { id: "wallet", title: "Wallet", icon: Wallet, href: "/delivery/wallet" },
    { id: "earnings", title: "Earnings", icon: IndianRupee, href: "/delivery/earnings" },
    { id: "notifications", title: "Notifications", icon: Bell, href: "/delivery/notifications", badge: notificationCount },
    { id: "profile", title: "Profile", icon: User, href: "/delivery/profile" },
    { id: "settings", title: "Settings", icon: Settings, href: "/delivery/settings" }
  ], [notificationCount]);

  const profileInitial = useMemo(() => {
    if (!deliveryBoy?.name) return "D";
    return deliveryBoy.name.charAt(0).toUpperCase();
  }, [deliveryBoy]);

  const statusColor = useMemo(() => isOnline ? "text-green-700 font-bold" : "text-red-700 font-bold", [isOnline]);
  const statusLabel = useMemo(() => isOnline ? "ONLINE" : "OFFLINE", [isOnline]);

  const notificationBadge = useMemo(() => {
    if (notificationCount <= 0) return null;
    if (notificationCount > 99) return "99+";
    return notificationCount;
  }, [notificationCount]);

  const canAccess = useCallback((menu) => true, []);

  if (loading) {
    return (
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 animate-pulse z-50">
        <div className="h-20 border-b flex items-center px-6">
          <div className="w-32 h-8 rounded bg-gray-200" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-32 h-4 bg-gray-200 rounded" />
              <div className="w-24 h-3 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" 
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 shadow-xl lg:shadow-none transition-all duration-300 flex flex-col ${collapsed ? "w-20" : "w-72"} ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        
        {/* Header */}
        <div className="h-20 border-b border-gray-100 flex items-center justify-between px-5 flex-shrink-0">
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-2xl font-black tracking-tight text-blue-600 truncate">MANTRA</h1>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery Partner</p>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto">
              <h1 className="text-xl font-black text-blue-600">M</h1>
            </div>
          )}
          <div className="flex items-center gap-1">
            <button 
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition" 
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
            <button 
              className="hidden lg:block p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition" 
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="border-b border-gray-100 p-5 bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
              {profileInitial}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">{deliveryBoy?.name || "Delivery Partner"}</h3>
                <p className="text-xs font-medium text-gray-500 truncate">{deliveryBoy?.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Circle size={8} fill={isOnline ? "#15803d" : "#b91c1c"} stroke="none" />
                  <span className={`text-[11px] tracking-wider ${statusColor}`}>{statusLabel}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
          {menus.filter(canAccess).map((item) => {
            const Icon = item.icon;
            const itemActive = isActive(item.href);
            
            if (item.children) {
              return (
                <div key={item.id} className="space-y-1">
                  <button 
                    onClick={() => setOrdersOpen(!ordersOpen)} 
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-gray-500" />
                      {!collapsed && <span className="text-sm font-semibold text-gray-800">{item.title}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown 
                        size={16} 
                        className={`text-gray-400 transition-transform duration-200 ${ordersOpen ? "rotate-180" : ""}`} 
                      />
                    )}
                  </button>
                  {ordersOpen && !collapsed && (
                    <div className="ml-9 pl-2 border-l border-gray-200 space-y-1 my-1">
                      {item.children.map((sub) => {
                        const subActive = isActive(sub.href);
                        return (
                          <Link 
                            key={sub.href} 
                            href={sub.href} 
                            className={`block rounded-lg px-3 py-2 text-xs font-medium transition ${
                              subActive 
                                ? "bg-blue-50 text-blue-600 font-bold" 
                                : "text-gray-600 hover:bg-slate-50 hover:text-gray-900"
                            }`}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link 
                key={item.id} 
                href={item.href} 
                title={collapsed ? item.title : ""} 
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  itemActive 
                    ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-100" 
                    : "text-gray-700 font-medium hover:bg-slate-100/80 hover:text-gray-900"
                }`}
              >
                <Icon size={20} className={itemActive ? "text-white" : "text-gray-500"} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-sm font-semibold">{item.title}</span>
                    {item.badge > 0 && (
                      <div className="bg-red-500 text-white rounded-full font-bold px-1.5 h-5 min-w-[20px] text-[10px] flex items-center justify-center">
                        {notificationBadge}
                      </div>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer / Logout */}
        <div className="border-t border-gray-100 p-4 flex-shrink-0 bg-white">
          <button onClick={logout} 
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50/80 transition-colors"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}