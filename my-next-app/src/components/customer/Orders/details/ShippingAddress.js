"use client";
import { MapPin, User, Phone, Mail, Home } from "lucide-react";
export default function ShippingAddress({ order }) {
  const shipping = order.shipping || {};
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <MapPin size={20} />
        <h2 className="text-lg font-semibold">Shipping Address</h2>
      </div>
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <User size={18} className="mt-1 text-gray-500" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Customer</p>
            <p className="font-semibold text-gray-900">{shipping.name}</p>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Phone size={18} className="mt-1 text-gray-500" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Mobile</p>
              <p className="font-medium text-gray-900">{shipping.mobile}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="mt-1 text-gray-500" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
              <p className="break-all font-medium text-gray-900">{shipping.email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Home size={18} className="mt-1 text-gray-500" />
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Delivery Address</p>
            <p className="mt-1 leading-7 text-gray-800">
              {shipping.address}
              <br />
              {shipping.city}, {shipping.state}
              <br />
              {shipping.country} - {shipping.pin}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}