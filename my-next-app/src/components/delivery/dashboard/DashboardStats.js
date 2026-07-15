"use client";
import { Package, CheckCircle2, Wallet, IndianRupee } from "lucide-react";

const cards = (stats) => [
  {
    title: "Pending Orders",
    value: stats?.pendingOrders || 0,
    icon: Package,
    color: "bg-orange-500"
  },
  {
    title: "Completed",
    value: stats?.completedOrders || 0,
    icon: CheckCircle2,
    color: "bg-green-600"
  },
  {
    title: "Wallet Balance",
    value: `₹${stats?.walletBalance || 0}`,
    icon: Wallet,
    color: "bg-blue-600"
  },
  {
    title: "Total Earnings",
    value: `₹${stats?.totalEarnings || 0}`,
    icon: IndianRupee,
    color: "bg-purple-600"
  }
];

export default function DashboardStats({ stats }) {
  return (
  
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
      {cards(stats).map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 hover:shadow-md transition-all duration-300 w-full overflow-hidden"
          >
            <div className="flex justify-between items-center gap-3">
              

              <div className="min-w-0 flex-1">
                <p className="text-gray-500 text-xs sm:text-sm font-medium truncate">
                  {item.title}
                </p>
  
                <h2 className="text-2xl xs:text-3xl font-bold mt-1 sm:mt-2 text-gray-800 tracking-tight truncate">
                  {item.value}
                </h2>
              </div>
              
              <div className={`${item.color} w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}