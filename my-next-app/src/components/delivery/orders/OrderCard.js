"use client";

import Image from "next/image";
import { MapPin, Phone, Eye, CalendarDays, Package, CheckCircle2, Clock3, XCircle, RotateCcw, Wallet, IndianRupee, Navigation, } from "lucide-react";

const STATUS_CONFIG = {
  Pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock3 },
  Confirmed: { color: "bg-blue-100 text-blue-700", icon: Package },
  Processing: { color: "bg-indigo-100 text-indigo-700", icon: Package },
  Packed: { color: "bg-purple-100 text-purple-700", icon: Package },
  Shipped: { color: "bg-cyan-100 text-cyan-700", icon: Navigation }, "Out For Delivery": { color: "bg-orange-100 text-orange-700", icon: Navigation },
  Delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  Cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
  Returned: { color: "bg-gray-100 text-gray-700", icon: RotateCcw }
};

export default function OrderCard({ order, onView }) {
  if (!order) return null;

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
  const StatusIcon = status.icon;
  const paymentBadge = order.paymentMethod === "COD" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700";

  return (
    <div className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center border-b p-5">
        <div>
          <p className="text-xs text-gray-500">Order ID</p>
          <h2 className="font-semibold">#{order.orderNumber || order._id.slice(-8)}</h2>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
          <StatusIcon size={16} />
          {order.status}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">
        {/* Customer */}
        <div className="flex items-center gap-4">
          <Image
            src={order.userId?.profileImage || "/images/avatar.png"}
            alt="customer"
            width={55}
            height={55}
            className="rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{order.userId?.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Phone size={14} />
              {order.userId?.mobile}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="flex gap-3">
          <MapPin className="text-red-500 mt-1" size={18} />
          <p className="text-sm text-gray-600 leading-6">
            {order.shipping?.address}
            {order.shipping?.city && `, ${order.shipping?.city}`}
            {order.shipping?.state && `, ${order.shipping?.state}`}
            {order.shipping?.pin && ` - ${order.shipping?.pin}`}
          </p>
        </div>

        {/* Info */}
        <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Items</p>
            <div className="flex items-center gap-2 mt-1">
              <Package size={16} />
              <span>{order.products?.length || 0}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <div className="flex items-center gap-2 mt-1 font-semibold">
              <IndianRupee size={16} />
              {order.pricing?.grandTotal}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Payment</p>
            <span className={`inline-flex mt-1 px-3 py-1 rounded-full text-xs font-semibold ${paymentBadge}`}>
              <Wallet size={14} className="mr-1" />
              {order.payment?.method}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Ordered On</p>
            <div className="flex items-center gap-2 mt-1">
              <CalendarDays size={16} />
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4 flex flex-wrap gap-3 justify-end">
        <a href={`tel:${order.userId?.mobile}`} className="px-4 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2 hover:bg-green-700">
          <Phone size={18} />
          Call
        </a>
        <a
          target="_blank"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.shipping?.address}, ${order.shipping?.city}`)}`}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700"
        >
          <Navigation size={18} />
          Navigate
        </a>
        <button onClick={() => onView(order)} className="px-4 py-2 rounded-lg bg-gray-900 text-white flex items-center gap-2 hover:bg-black">
          <Eye size={18} />
          View Details
        </button>
      </div>
    </div>
  );
}