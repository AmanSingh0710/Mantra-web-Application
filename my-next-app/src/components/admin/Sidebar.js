"use client";

import { fetchFromAPI } from "@/utils/api";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaChevronDown, FaThLarge, FaShoppingCart, FaBoxOpen, FaTags, FaUsers, FaChartBar, FaBullhorn, FaMoneyBillWave, FaImage, FaPercentage, FaUser, FaChevronUp, FaPaperPlane,
    FaHome, FaBell, FaCog, FaQuestionCircle, FaComments, FaEnvelope, FaHeadset, FaChartLine, FaFileAlt, FaExchangeAlt, FaUserFriends, FaBiking, FaUserShield, FaRss, FaHistory
} from "react-icons/fa";

const SidebarSubItem = ({ label, tabKey, activeTab, setActiveTab }) => {
    // Check if this tab is currently selected
    const isActive = activeTab === tabKey;

    return (
        <button
            onClick={() => setActiveTab(tabKey)} // Click hote hi state update hogi
            className={`flex items-center gap-3 px-3 py-2 text-xs transition-all w-full text-left rounded-r-md ${isActive
                ? "text-white bg-[#ffffff10] border-l-2 border-amber-500 font-bold"
                : "text-gray-400 hover:text-white hover:bg-[#ffffff05]"
                }`}
        >
            {/* The bullet dot from your screenshots */}
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive
                ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                : "bg-gray-600"
                }`} />

            <span>{label}</span>
        </button>
    );
};

export default function AdminSidebar({ data, isOpen, setIsOpen, setActiveTab, activeTab }) {
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const pathname = usePathname();
    const [productCount, setProductCount] = useState(0);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const toggleSubMenu = (menu) => {
        setOpenSubMenu(openSubMenu === menu ? null : menu);
    };

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const data = await fetchFromAPI("/Adminproducts?limit=1");
                setProductCount(data?.totalProducts || 0);
            } catch (err) {
                console.error("Count fetch error:", err.message);
            }
        };

        fetchCount();
    }, []);

    // Nav Item helper function to check active state
    const isActive = (path) => pathname === path;

    const SidebarSubItem = ({ label, count, tab, colorClass = "text-cyan-400", }) => (
        <button
            onClick={() => {
                setActiveTab(tab);
                setIsOpen(false);
            }}
            className="flex justify-between items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#ffffff10] rounded-lg transition w-full text-left"
        >
            <span>{label}</span>

            {count !== undefined && (
                <span className={`${colorClass} text-xs font-bold`}>
                    {count}
                </span>
            )}
        </button>
    );


    return (
        <>
            {/* Mobile Overlay: Sidebar khulne par background dark karne ke liye */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Main Container */}
            <aside className={`
                  fixed lg:static inset-y-0 left-0 z-50
                  w-64 bg-[#4f1f03] text-gray-300 transform transition-transform duration-300 ease-in-out
                  ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                  overflow-y-auto custom-scrollbar flex flex-col
                `}>

                {/* LOGO SECTION - Ab ye Sidebar ka hissa hai */}
                <div className="p-4 bg-[#2c394b] border-b border-[#3d4b5f] flex items-center justify-center">
                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                        <Image
                            src="/Lebrostone logo.png"
                            alt="Lebrostone"
                            width={140}
                            height={40}
                            className="object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Sidebar Search */}
                <div className="p-4 bg-[#2c394b]">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search menu..."
                            className="w-full bg-[#3d4b5f] border-none rounded text-xs py-2 px-3 focus:ring-1 focus:ring-amber-500 outline-none text-white"
                        />
                    </div>
                </div>

                <nav className="p-2 space-y-1">

                    {/* Dashboard Link */}
                    <Link href="/admin" className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition ${isActive('/admin') ? 'bg-amber-600 text-white' : 'hover:bg-[#3d4b5f]'}`}>
                        <FaThLarge size={16} />
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>

                    {/* ORDER MANAGEMENT SECTION */}
                    <p className="text-[10px] font-bold text-gray-500 uppercase px-4 mt-4 mb-2 tracking-wider">Order Management</p>

                    {/* Orders Dropdown */}
                    <div>
                        <button
                            onClick={() => toggleSubMenu('orders')}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-[#3d4b5f] transition"
                        >
                            <div className="flex items-center gap-3">
                                <FaShoppingCart size={16} className="text-green-400" />
                                <span className="text-sm font-medium cursor-pointer">Orders</span>
                            </div>
                            <FaChevronDown size={10} className={`transition-transform ${openSubMenu === 'orders' ? 'rotate-180' : ''}`} />
                        </button>

                        {openSubMenu === 'orders' && (
                            <div className="ml-9 mt-1 space-y-1">
                                {[
                                    { label: "All", count: data?.orderStatus?.all, tab: "orders" },
                                    { label: "Pending", count: data?.orderStatus?.pending, tab: "orders_pending" },
                                    { label: "Confirmed", count: data?.orderStatus?.confirmed, tab: "orders_confirmed" },
                                    { label: "Packaging", count: data?.orderStatus?.packaging, tab: "orders_packaging" },
                                    { label: "Out for Delivery", count: data?.orderStatus?.out_for_delivery, tab: "orders_shipping" },
                                    { label: "Delivered", count: data?.orderStatus?.delivered, tab: "orders_delivered" },
                                    { label: "Canceled", count: data?.orderStatus?.canceled, tab: "orders_canceled" },
                                    { label: "Returned", count: data?.orderStatus?.returned, tab: "orders_returned" },
                                    { label: "Failed to Delivery", count: data?.orderStatus?.failed, tab: "orders_failed" }
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveTab(item.tab)}
                                        className="flex justify-between items-center px-3 py-1.5 text-xs hover:text-white cursor-pointer transition"
                                    >
                                        {item.label}
                                        <span className="bg-[#4a5a6e] px-2 py-0.5 rounded-full text-[10px]">
                                            {item.count || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Refund Requests Dropdown */}
                    <div>
                        <button
                            onClick={() => toggleSubMenu('refunds')}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-[#3d4b5f] transition mt-1"
                        >
                            <div className="flex items-center gap-3">
                                <FaMoneyBillWave size={16} className="text-[#90c090]" />
                                <span className="text-sm font-medium text-gray-300 cursor-pointer">Refund Requests</span>
                            </div>
                            <FaChevronDown size={10} className={`transition-transform text-gray-500 ${openSubMenu === 'refunds' ? 'rotate-180' : ''}`} />
                        </button>

                        {openSubMenu === 'refunds' && (
                            <div className="ml-9 mt-1 space-y-1 border-l border-gray-700 ">
                                {[
                                    { label: "Pending", count: data?.refunds?.pending, value: "pending", color: "text-pink-500" },
                                    { label: "Approved", count: data?.refunds?.approved, value: "approved", color: "text-cyan-400" },
                                    { label: "Refunded", count: data?.refunds?.refunded, value: "refunded", color: "text-cyan-400" },
                                    { label: "Rejected", count: data?.refunds?.rejected, value: "rejected", color: "text-pink-500" }
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveTab(item.value)} // Yahan state update hogi
                                        className={`flex w-full justify-between items-center px-3 py-1.5 text-xs rounded-r-md transition cursor-pointer ${activeTab === item.value ? "text-white bg-[#3d4b5f]" : "text-gray-400 hover:text-white hover:bg-[#3d4b5f]"
                                            }`}
                                    >
                                        {item.label}
                                        <span className={`bg-[#3d4b5f] ${item.color} px-2 py-0.5 rounded-full text-[10px] font-bold`}>
                                            {item.count || 0}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- PRODUCT MANAGEMENT --- */}
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase px-4 mt-4 mb-2 tracking-[2px]">Product Management</p>
                        <button onClick={() => toggleSubMenu('category')} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#ffffff10] transition">
                            <div className="flex items-center gap-3">
                                <FaTags size={18} className="text-[#90c090]" />
                                <span className="text-sm font-bold text-gray-200 cursor-pointer">Category Setup</span>
                            </div>
                            <FaChevronDown size={10} className={`transition-transform text-gray-400 cursor-pointer ${openSubMenu === 'category' ? 'rotate-180' : ''}`} />
                        </button>

                        {openSubMenu === 'category' && (
                            <div className="ml-6 mt-2 space-y-1 border-l border-white/10 pl-2 ">
                                <SidebarSubItem label="Categories" tab="category" />
                                <SidebarSubItem label="Sub Categories" tab="subcategory" />
                                <SidebarSubItem label="Sub Sub Categories" tab="subsubcategory" />
                            </div>
                        )}
                    </div>

                    {/* --- BRANDS SECTION --- */}
                    <div>
                        <button
                            onClick={() => toggleSubMenu('brands')}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-[#3d4b5f] transition mt-1"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[#90c090] text-lg">⭐</span>
                                <span className="text-sm font-medium text-gray-300 cursor-pointer">Brands</span>
                            </div>
                            <FaChevronDown size={10} className={`transition-transform ${openSubMenu === 'brands' ? 'rotate-180' : ''}`} />
                        </button>

                        {openSubMenu === 'brands' && (
                            <div className="ml-9 mt-1 space-y-1 border-l border-gray-700 cursor-pointer">
                                {/* Add New Button */}
                                <button
                                    onClick={() => setActiveTab('brands_add')}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#3d4b5f] rounded-md transition cursor-pointer"
                                >
                                    Add New
                                </button>

                                {/* List Button */}
                                <button
                                    onClick={() => setActiveTab('brands_list')}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#3d4b5f] rounded-md transition cursor-pointer"
                                >
                                    Brand List
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --- PRODUCT ATTRIBUTE SETUP (New) --- */}
                    <div>
                        <button onClick={() => toggleSubMenu('attributes')} className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-[#3d4b5f] transition mt-1">
                            <div className="flex items-center gap-3">
                                <span className="text-[#90c090] text-lg">📑</span>
                                <span className="text-sm font-medium text-gray-300 cursor-pointer">Product Attribute Setup</span>
                            </div>
                            <FaChevronDown size={10} className={`transition-transform ${openSubMenu === 'attributes' ? 'rotate-180' : ''}`} />
                        </button>
                        {openSubMenu === 'attributes' && (
                            <div className="ml-9 mt-1 space-y-1 border-l border-gray-700">
                                <button
                                    onClick={() => setActiveTab("attributes")} // Layout ke activeTab state ko update karega
                                    className={`w-full text-left px-4 py-2 text-sm transition  cursor-pointer ${activeTab === 'attribute' ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    • Attribute List
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --- IN-HOUSE PRODUCTS SECTION --- */}
                    <div>
                        <button
                            onClick={() => toggleSubMenu('inhouse')}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-[#3d4b5f] transition group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                {/* Screenshot ke mutabiq Green Icon */}
                                <FaBoxOpen size={16} className="text-[#90c090]" />
                                <span className="text-sm font-medium text-gray-300 cursor-pointer">In-house Products</span>
                            </div>
                            <FaChevronDown size={10} className={`transition-transform text-gray-500 ${openSubMenu === 'inhouse' ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown open hone par ye options dikhenge */}
                        {openSubMenu === 'inhouse' && (
                            <div className="ml-9 mt-1 space-y-1 border-l border-gray-700 cursor-pointer">

                                {/* 1. Product List */}
                                <div onClick={() => setActiveTab("product_list")}>
                                    <SidebarSubItem
                                        label="Product List"
                                        path="#" // Path ki jagah hum state use karenge
                                        count={productCount}
                                        active={activeTab === "product_list"}
                                    />
                                </div>

                                {/* 2. Add New Product */}
                                <div onClick={() => setActiveTab("product_add")}>
                                    <SidebarSubItem
                                        label="Add New Product"
                                        path="#"
                                        active={activeTab === "product_add"}
                                    />
                                </div>

                                {/* 3. Bulk Import */}
                                <div onClick={() => setActiveTab("bulk_import")}>
                                    <SidebarSubItem
                                        label="Bulk import"
                                        path="#"
                                        active={activeTab === "bulk_import"}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- PROMOTION MANAGEMENT --- */}
                    <p className="text-[10px] font-bold text-gray-400 uppercase px-4 mt-6 mb-2 tracking-[2px] cursor-pointer">
                        Promotion Management
                    </p>

                    {/* Banner Setup - Simple Link */}
                    <div
                        onClick={() => {
                            setActiveTab("banner_setup");
                            setIsOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-[#ffffff10] transition ${activeTab === "banner_setup" ? 'bg-amber-600 text-white' : ''}`}
                    >
                        <FaImage size={16} className="text-[#90c090]" />
                        <span className="text-sm font-medium cursor-pointer" >Banner Setup</span>
                    </div>

                    {/* Hero Banner Setup */}
                    <div
                        onClick={() => {
                            setActiveTab("hero_banner");
                            setIsOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-[#ffffff10] transition ${activeTab === "hero_banner"
                            ? "bg-amber-600 text-white"
                            : ""
                            }`}
                    >
                        <FaImage size={16} className="text-[#90c090]" />

                        <span className="text-sm font-medium cursor-pointer">
                            Hero Banner
                        </span>
                    </div>

                    {/* Offers & Deals - Dropdown (As per Screenshot 175322) */}
                    <div>
                        <button
                            onClick={() => toggleSubMenu('offers')}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-[#ffffff10] transition"
                        >
                            <div className="flex items-center gap-3">
                                <FaPercentage size={16} className="text-[#90c090]" />
                                <span className="text-sm font-medium text-gray-300">Offers & Deals</span>
                            </div>
                            <FaChevronDown size={10} className={`transition-transform duration-200 ${openSubMenu === 'offers' ? 'rotate-180' : ''}`} />
                        </button>

                        {openSubMenu === 'offers' && (
                            <div className="ml-9 mt-1 space-y-1 border-l border-gray-700">
                                <SidebarSubItem label="Coupon" path="/admin/promotion/coupons" pathname={pathname} />
                                <SidebarSubItem label="Flash Deals" path="/admin/promotion/flash-deals" pathname={pathname} />
                                <SidebarSubItem label="Deal of the day" path="/admin/promotion/deal-of-day" pathname={pathname} />
                                <SidebarSubItem label="Featured Deal" path="/admin/promotion/featured-deal" pathname={pathname} />
                            </div>
                        )}


                    </div>

                   {/* Story */}
                    <button
                        onClick={() => { setActiveTab("stories"); setIsOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-[#2d3748] transition text-left ${activeTab === "stories" ? 'bg-amber-600 text-white font-bold' : ''}`}
                    >
                        <FaHistory size={16} className="text-[#90c090]" />
                        <span className="text-sm font-medium">Stories</span>
                    </button>

                    {/* Notifications Dropdown Main Menu */}
                    <div className="mb-2">
                        <button
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className={`flex items-center justify-between w-full p-3 rounded-lg transition-all ${activeTab.includes("notification") ? "bg-[#ffffff15] text-green-400" : "hover:bg-[#ffffff10]"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <FaBell className={activeTab.includes("notification") ? "text-green-400" : "text-gray-400"} />
                                <span className="font-medium">Notifications</span>
                            </div>
                            {isNotificationOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </button>

                        {/* Sub-menus (Dropdown Content) */}
                        {isNotificationOpen && (
                            <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-600">
                                {/* Option 1: Send Notification */}
                                <button
                                    onClick={() => setActiveTab("send_notification")}
                                    className={`flex items-center gap-3 w-full p-2 pl-4 text-sm transition-all ${activeTab === "send_notification" ? "text-green-400 font-bold" : "text-gray-300 hover:text-white"
                                        }`}
                                >
                                    <FaPaperPlane size={14} />
                                    <span>Send Notification</span>
                                </button>

                                {/* Option 2: Push Notification Setup */}
                                <button
                                    onClick={() => setActiveTab("notification_setup")}
                                    className={`flex items-center gap-3 w-full p-2 pl-4 text-sm transition-all ${activeTab === "notification_setup" ? "text-green-400 font-bold" : "text-gray-300 hover:text-white"
                                        }`}
                                >
                                    <FaCog size={14} />
                                    <span>Push Notifications Setup</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Announcment*/}
                    <button onClick={() => setActiveTab("AdminAnnouncements")} className={`flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-[#ffffff10] transition ${activeTab === "announcements" ? 'bg-amber-600 text-white' : ''}`}>
                        <FaImage size={16} className="text-[#90c090]" />
                        <span className="text-sm font-medium">Announcement</span>
                    </button>

                    {/* --- HELP & SUPPORT SECTION --- */}
                    <p className="text-[10px] font-bold text-gray-400 uppercase px-4 mt-6 mb-2 tracking-[2px]">
                        Help & Support
                    </p>

                    {/* Inbox */}
                    <button
                        onClick={() => setActiveTab("support_inbox")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition hover:bg-[#ffffff10] ${activeTab === 'support_inbox' ? 'bg-amber-600 text-white' : 'text-gray-300'
                            }`}
                    >
                        <FaComments size={16} className={activeTab === 'support_inbox' ? 'text-white' : 'text-gray-400'} />
                        <span className="text-sm font-medium">Inbox</span>
                    </button>

                    {/* Messages */}
                    <button
                        onClick={() => setActiveTab("support_messages")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition hover:bg-[#ffffff10] ${activeTab === 'support_messages' ? 'bg-amber-600 text-white' : 'text-gray-300'
                            }`}
                    >
                        <FaEnvelope size={16} className={activeTab === 'support_messages' ? 'text-white' : 'text-gray-400'} />
                        <span className="text-sm font-medium">Messages</span>
                    </button>

                    {/* Support Ticket */}
                    <button
                        onClick={() => setActiveTab("support_tickets")}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition hover:bg-[#ffffff10] ${activeTab === 'support_tickets' ? 'bg-amber-600 text-white' : 'text-gray-300'
                            }`}
                    >
                        <FaHeadset size={16} className={activeTab === 'support_tickets' ? 'text-white' : 'text-gray-400'} />
                        <span className="text-sm font-medium">Support Ticket</span>
                    </button>


                    {/* --- REPORTS & ANALYSIS SECTION --- */}
                    <p className="text-[10px] font-bold text-gray-400 uppercase px-4 mt-6 mb-2 tracking-[2px]">
                        Reports & Analysis
                    </p>

                    {/* Sales & Transaction Report Dropdown */}
                    <div>
                        <button
                            onClick={() => toggleSubMenu('reports')}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-[#ffffff10] transition group"
                        >
                            <div className="flex items-center gap-3">
                                <FaChartLine size={16} className="text-gray-400 group-hover:text-[#90c090]" />
                                <span className="text-sm font-medium text-gray-300">Sales & Transaction Repo</span>
                            </div>
                            <FaChevronDown size={10} className={`transition-transform duration-200 ${openSubMenu === 'reports' ? 'rotate-180' : ''}`} />
                        </button>

                        {openSubMenu === 'reports' && (
                            <div className="ml-9 mt-1 space-y-1 border-l border-gray-700">
                                {/* As per Screenshot 181412 */}
                                <SidebarSubItem label="Earning Reports" path="/admin/reports/earning" pathname={pathname} />
                                <SidebarSubItem label="Inhouse Sales" path="/admin/reports/inhouse-sales" pathname={pathname} />
                                <SidebarSubItem label="Vendor Sales" path="/admin/reports/vendor-sales" pathname={pathname} />
                                <SidebarSubItem label="Transaction Report" path="/admin/reports/transaction" pathname={pathname} />
                            </div>
                        )}
                    </div>

                    {/* Product Report (Single Link) */}
                    <Link
                        href="/admin/reports/product"
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-[#ffffff10] transition ${pathname === '/admin/reports/product' ? 'bg-amber-600 text-white shadow-sm' : ''}`}
                    >
                        <FaChartLine size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">Product Report</span>
                    </Link>

                    {/* Order Report (Single Link) */}
                    <Link
                        href="/admin/reports/order"
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-[#ffffff10] transition ${pathname === '/admin/reports/order' ? 'bg-amber-600 text-white shadow-sm' : ''}`}
                    >
                        <FaChartLine size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">Order Report</span>
                    </Link>

                    {/* --- USER MANAGEMENT SECTION --- */}
                    <p className="text-[10px] font-bold text-gray-400 uppercase px-4 mt-6 mb-2 tracking-[2px]">
                        User Management
                    </p>

                    {/* Customers Dropdown */}
                    <div>
                        <button
                            onClick={() => toggleSubMenu('customers')}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-[#ffffff10] transition group"
                        >
                            <div className="flex items-center gap-3">
                                {/* Wallet style icon as per screenshot */}
                                <FaUserFriends size={16} className="text-[#90c090]" />
                                <span className="text-sm font-medium text-[#90c090]">Customers</span>
                            </div>
                            <FaChevronDown size={10} className={`transition-transform duration-200 text-gray-500 ${openSubMenu === 'customers' ? 'rotate-180' : ''}`} />
                        </button>

                        {openSubMenu === 'customers' && (
                            <div className="ml-9 mt-1 space-y-1 border-l border-gray-700">

                                {/* 1. Customer List */}
                                <div onClick={() => setActiveTab("customers")}>
                                    <SidebarSubItem
                                        label="Customer List"
                                        path="#"
                                        active={activeTab === "customers"}
                                    />
                                </div>

                                {/* 2. Customer Reviews */}
                                <div onClick={() => setActiveTab("customer_reviews")}>
                                    <SidebarSubItem
                                        label="Customer Reviews"
                                        path="#"
                                        active={activeTab === "customer_reviews"}
                                    />
                                </div>

                                {/* 3. Wallet */}
                                <div onClick={() => setActiveTab("customer_wallet")}>
                                    <SidebarSubItem
                                        label="Wallet"
                                        path="#"
                                        active={activeTab === "customer_wallet"}
                                    />
                                </div>

                                {/* 4. Wallet Bonus Setup */}
                                <div onClick={() => setActiveTab("wallet_bonus")}>
                                    <SidebarSubItem
                                        label="Wallet Bonus Setup"
                                        path="#"
                                        active={activeTab === "wallet_bonus"}
                                    />
                                </div>

                                {/* 5. Loyalty Points */}
                                <div onClick={() => setActiveTab("loyalty_points")}>
                                    <SidebarSubItem
                                        label="Loyalty Points"
                                        path="#"
                                        active={activeTab === "loyalty_points"}
                                    />
                                </div>

                            </div>
                        )}
                    </div>

                    {/* Delivery Men Dropdown - Detailed Version */}
                    <div>
                        <button
                            onClick={() => toggleSubMenu('delivery')}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-[#ffffff10] transition group"
                        >
                            <div className="flex items-center gap-3">
                                {/* Light Green Icon as per screenshot */}
                                <FaBiking size={16} className="text-[#90c090]" />
                                <span className="text-sm font-medium text-[#90c090]">Delivery Men</span>
                            </div>
                            <FaChevronDown size={10} className={`transition-transform duration-200 text-gray-500 ${openSubMenu === 'delivery' ? 'rotate-180' : ''}`} />
                        </button>

                        {openSubMenu === 'delivery' && (
                            <div className="ml-9 mt-1 space-y-1 border-l border-gray-700">
                                {/* 1. Add new */}
                                <div onClick={() => setActiveTab("add_deliveryman")}>
                                    <SidebarSubItem
                                        label="Add Delivery Man"
                                        path="#"
                                        active={activeTab === "add_deliveryman"}
                                    />
                                </div>

                                {/* 2. List */}
                                <div onClick={() => setActiveTab("deliveryman_list")}>
                                    <SidebarSubItem
                                        label="deliveryman_list"
                                        path="#"
                                        active={activeTab === "deliveryman_list"}
                                    />
                                </div>

                                {/* 3. Withdraws */}
                                <SidebarSubItem label="Withdraws" path="/admin/users/delivery/withdraws" pathname={pathname} />

                                {/* 4. Emergency Contact */}
                                <SidebarSubItem label="Emergency Contact" path="/admin/users/delivery/emergency-contact" pathname={pathname} />
                            </div>
                        )}
                    </div>

                    {/* Employees Dropdown */}
                    <div>
                        <button
                            onClick={() => toggleSubMenu('employees')}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-[#ffffff10] transition group"
                        >
                            <div className="flex items-center gap-3">
                                <FaUserShield size={16} className="text-gray-400 group-hover:text-[#90c090]" />
                                <span className="text-sm font-medium text-gray-300">Employees</span>
                            </div>
                            <FaChevronDown size={10} className={`transition-transform duration-200 ${openSubMenu === 'employees' ? 'rotate-180' : ''}`} />
                        </button>
                        {openSubMenu === 'employees' && (
                            <div className="ml-9 mt-1 space-y-1 border-l border-gray-700">
                                <SidebarSubItem label="Employee Role" tab="employee_role" setActiveTab={setActiveTab} />
                                <SidebarSubItem label="Add New" tab="employee_add" setActiveTab={setActiveTab} />
                                <SidebarSubItem label="List" tab="employee_list" setActiveTab={setActiveTab} />
                            </div>
                        )}
                    </div>

                    {/* Subscribers (State-driven tab change) */}
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("subscribers");
                            // If on mobile view, optionally close sidebar:
                            // setIsOpen(false); 
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-[#ffffff10] transition ${activeTab === 'subscribers' ? 'bg-amber-600 text-white' : ''}`}
                    >
                        <FaRss size={16} className={activeTab === 'subscribers' ? 'text-white' : 'text-gray-400'} />
                        <span className="text-sm font-medium">Subscribers</span>
                    </button>
                </nav>
            </aside>
        </>
    );
}