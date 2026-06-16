// app/admin/layout.js
"use client";

import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import DashboardHome from "@/components/admin/DashboardHome";
import AllOrders from "@/components/admin/AllOrders";
import AllStores from "@/components/admin/AllStores";
import AllProducts from "@/components/admin/AllProducts";
import AllCustomers from "@/components/admin/AllCustomers";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements"
import AdminCategoryPage from "@/components/admin//category/AdminCategoryPage"
import BrandManager from "@/components/admin/Brands/BrandManager";
import AttributeSetup from "@/components/admin/attributes/AttributeSetup";
import AddProduct from "@/components/admin/InHouseProduct/AddProduct";
import InHouseProductList from "@/components/admin/InHouseProduct/InHouseProductList";
import BulkImport from "@/components/admin/InHouseProduct/BulkImport";
import CustomerReviews from "@/components/admin/customers/CustomerReviews";
import BannerSetup from "@/components/admin/banners/BannerSetup";
import AdminHeroesPage from "./hero/page";
import Approved from "@/components/admin/refundRequests/Approved";
import Pending from "@/components/admin/refundRequests/Pending";
import Refunded from "@/components/admin/refundRequests/Refunded";
import Rejected from "@/components/admin/refundRequests/Rejected";
import NotificationPage from "@/components/admin/Notification/NotificationPage";
import PushNotificationSetup from "@/components/admin/Notification/PushNotificationSetup";
import AddDeliveryManPage from "@/components/admin/deliveryman/AddDeliveryMan";
import DeliveryManList from "@/components/admin/deliveryman/DeliveryManList";
import AddEmployee from "@/components/admin/Employees/AddEmployee";
import EmployeeList from "@/components/admin/Employees/EmployeeList";
import EmployeeRole from "@/components/admin/Employees/EmployeeRole";
import InboxPage from "@/components/admin/helpSupport/InboxPage";
import MessageDetail from "@/components/admin/helpSupport/MessageDetail";
import SupportTicketsPage from "@/components/admin/helpSupport/SupportTicketsPage";
import AdminSettings from "@/components/admin/adminSetting/AdminSettings";
import Newsletter from "@/components/admin/Newsletter/NewsletterList";
import OurStory from "@/components/admin/OurStory";

import { useState, useEffect } from "react";


export default function AdminLayout({ children }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome setActiveTab={setActiveTab} />;

      case "orders":
      case "orders_pending":
      case "orders_confirmed":
      case "orders_packaging":
      case "orders_shipping":
      case "orders_delivered":
      case "orders_canceled":
      case "orders_returned":
      case "orders_failed":
        return <AllOrders filter={activeTab} />;

      case "stores":
        return <AllStores />;

      case "products":
        return <AllProducts />;

      case "category":
        return <AdminCategoryPage />;

      case "brands_add":
        return <BrandManager initialView="add" />;

      case "brands_list":
        return <BrandManager initialView="list" />;

      case "product_list":
        return <InHouseProductList setActiveTab={setActiveTab} />;

      case "product_add":
        return <AddProduct />;

      case "bulk_import":
        return <BulkImport />;

      case "attributes":
        return <AttributeSetup />;

      case "announcements":
        return <AdminAnnouncements />;

      // --- CUSTOMER MANAGEMENT TABS ---
      case "customers":
        return <AllCustomers />; // Aapka main Customer List component

      case "customer_reviews":
        return <CustomerReviews />

      case "customer_wallet":
        return <div className="p-6 bg-white rounded-xl shadow-sm">💰 Customer Wallet Management</div>;

      case "wallet_bonus":
        return <div className="p-6 bg-white rounded-xl shadow-sm">🎁 Wallet Bonus Setup</div>;

      case "loyalty_points":
        return <div className="p-6 bg-white rounded-xl shadow-sm">🏆 Loyalty Points System</div>;

      case "banner_setup":
        return <BannerSetup />;

      case "hero_banner":
        return <AdminHeroesPage />;

      // --- Refund TABS ---
      case "approved":
        return <Approved />;

      case "pending":
        return <Pending />;

      case "refunded":
        return <Refunded />;

      case "rejected":
        return <Rejected />;

      case "stories":
        return <OurStory />

      case "profile":
      case "settings":
        return <AdminSettings />;

      case "send_notification":
        return <NotificationPage />;

      case "notification_setup":
        return <PushNotificationSetup />;

      case "AdminAnnouncements":
        return <AdminAnnouncements />

        case "blog_add":
           return<AdminAddBlog />

           case "blog_list":
            return<AdminBlogList />

      case "add_deliveryman":
        return <AddDeliveryManPage />

      case "deliveryman_list":
        return <DeliveryManList setActiveTab={setActiveTab} />

      // --- EMPLOYEE MANAGEMENT ---
      case "employee_role":
        return <EmployeeRole />;

      case "employee_add":
        return <AddEmployee />;

      case "employee_list":
        return <EmployeeList />;

      // --- HELP & SUPPORT TABS ---
      case "support_inbox":
        return <InboxPage setActiveTab={setActiveTab} setSelectedTicketId={setSelectedTicketId} />;

      case "support_messages":
        return <MessageDetail ticketId={selectedTicketId} setActiveTab={setActiveTab} />;

      case "support_tickets":
        return <SupportTicketsPage setActiveTab={setActiveTab} />;

      case "subscribers":
        return <Newsletter />



      default:
        return (
          <DashboardHome
            setActiveTab={setActiveTab}
            stats={dashboardData}
          />
        );
    }
  };





  return (
    <div className="admin-layout flex flex-col h-screen">

      {/* Top Navbar fix rahega */}
      <Navbar
        data={null}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        setActiveTab={setActiveTab}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar fix rahega */}
        <Sidebar
          data={null}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />


        {/* Dynamic Content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}