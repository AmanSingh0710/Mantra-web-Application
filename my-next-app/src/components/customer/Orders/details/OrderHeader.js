"use client";

import Link from "next/link";
import {ArrowLeft,Package,Calendar,IndianRupee} from "lucide-react";
import OrderStatusBadge from "../OrderStatusBadge";

export default function OrderHeader({order}){

  const orderDate=new Date(order.createdAt).toLocaleDateString("en-IN",{
    day:"2-digit",
    month:"long",
    year:"numeric"
  });

  return(
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link href="/my-orders" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black">
            <ArrowLeft size={18}/>
            Back to My Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Package size={18}/>
              <span className="font-semibold">{order.orderNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18}/>
              {orderDate}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <OrderStatusBadge status={order.status}/>
          <div className="flex items-center text-2xl font-bold text-gray-900">
            <IndianRupee size={22}/>
            {order.pricing?.grandTotal?.toLocaleString("en-IN")}
          </div>
          <p className="text-sm text-gray-500">
            Payment : <span className="ml-1 font-semibold text-black">{order.payment?.method}</span>
          </p>
          <p className={`text-sm font-semibold ${order.payment?.status==="Paid"?"text-green-600":"text-orange-600"}`}>
            {order.payment?.status}
          </p>
        </div>
      </div>
    </div>
  );
}