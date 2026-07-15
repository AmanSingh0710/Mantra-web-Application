"use client";

import { fetchFromAPI, getImageUrl } from "@/utils/api";
import { useState, useEffect } from "react";
import { ROLE_CONFIG } from "@/constants/roles";
//src/components/admin/Employees/EmployeeRole.js


export default function EmployeeRole() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await fetchFromAPI("/employees");

        setEmployees(data.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <div className="p-6 text-center">Connecting to Server...</div>;

  return (
    <div className="p-6 bg-[#f4f7f9] min-h-screen text-gray-800">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Active Team Members</h2>
        <p className="text-sm text-gray-500 mt-1">Real-time data from your backend.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {employees.map((emp) => {
          // 1. Handle Role Logic: If no role, check if 'deliveryman_image' exists to assume they are DELIVERY
          const detectedRole = emp.role;
          const config = ROLE_CONFIG[detectedRole] || ROLE_CONFIG.UNKNOWN;

          const profileImage = emp.image?.url || "/default-user.png";
          const status = emp.type === "DELIVERY_BOY" ? (emp.isBlocked ? "inactive" : "active") : emp.status;

          return (
            <div key={emp._id} className="group relative bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">

              {/* Dynamic Icon */}
              <div className={`w-12 h-12 ${config.color} rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                {/* If user has an image, show it, otherwise show the Role Icon */}
                {profileImage ? (
                  <img src={profileImage} className="w-full h-full object-cover rounded-lg" alt="profile" />
                ) : (
                  config.icon
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {emp.name}
              </h3>

              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">
                {detectedRole}
              </span>

              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {config.desc}
              </p>

              {/* Show total orders if they are a deliveryman */}
              {emp.totalDeliveries !== undefined && (
                <div className="mb-4 text-xs font-semibold text-blue-600">
                  Total Deliveries: {emp.totalDeliveries}
                </div>
              )}

              {/* Status & Phone */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {status}
                </span>

                <span className="text-xs text-gray-400">{emp.phone}</span>
              </div>

              <div className={`absolute bottom-0 left-0 w-full h-1 bg-transparent ${config.accent} rounded-b-xl transition-colors`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}