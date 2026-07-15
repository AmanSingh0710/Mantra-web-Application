"use client";
import Link from "next/link";

export default function RecentOrders({ orders = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 w-full overflow-hidden">
      
      <div className="flex justify-between items-center mb-4 sm:mb-5 gap-4">
        <h2 className="font-bold text-base sm:text-lg text-gray-800">
          Recent Orders
        </h2>
        <Link
          href="/delivery/orders"
          className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm active:scale-[0.98] transition-all whitespace-nowrap"
        >
          View All
        </Link>
      </div>

      <div className="w-full overflow-x-auto scrollbar-thin border border-gray-100 rounded-xl">
        <table className="w-full min-w-[600px] table-auto border-collapse text-left">
          
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="py-3 px-4 text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">Order</th>
              <th className="py-3 px-3 text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">Customer</th>
              <th className="py-3 px-3 text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">Amount</th>
              <th className="py-3 px-3 text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">Status</th>
              <th className="py-3 px-4 text-xs sm:text-sm font-semibold text-gray-600 tracking-tight">Date</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-50 text-gray-700">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-xs sm:text-sm text-gray-400 font-medium bg-white">
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((order) => (
                <tr 
                  key={order._id} 
                  className="hover:bg-blue-50/20 transition-colors group"
                >
                  <td className="py-3.5 px-4 text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px]">
                    {order.orderNumber}
                  </td>
                  
                  <td className="py-3.5 px-3 text-xs sm:text-sm text-gray-600 truncate max-w-[150px]">
                    {order.shipping?.name}
                  </td>
                  
                  {/* Amount Value */}
                  <td className="py-3.5 px-3 text-xs sm:text-sm font-semibold text-gray-900">
                    ₹{order.pricing?.grandTotal}
                  </td>
                  
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide shadow-sm ${
                      order.status === "Delivered"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  
                  <td className="py-3.5 px-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}