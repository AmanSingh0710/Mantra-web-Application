"use client";
import { CreditCard, Wallet, CheckCircle, Clock } from "lucide-react";

export default function PaymentDetails({ order }) {
  const payment = order.payment || {};
  const paid = payment.status === "Paid";
  const methodLabel = { COD: "Cash On Delivery", RAZORPAY: "Razorpay", STRIPE: "Stripe" };
  
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <CreditCard size={20} />
        <h2 className="text-lg font-semibold">Payment Details</h2>
      </div>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Payment Method</span>
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <Wallet size={16} />
            {methodLabel[payment.method] || payment.method}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Payment Status</span>
          <div className={`flex items-center gap-2 font-semibold ${paid ? "text-green-600" : "text-orange-600"}`}>
            {paid ? <CheckCircle size={18} /> : <Clock size={18} />}
            {payment.status}
          </div>
        </div>
        {payment.transactionId && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-medium break-all">{payment.transactionId}</span>
          </div>
        )}
        {payment.paidAt && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Paid On</span>
            <span className="font-medium">
              {new Date(payment.paidAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        )}
        <div className={`rounded-lg p-4 text-sm font-medium ${payment.method === "COD" ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"}`}>
          {payment.method === "COD" ? "Cash will be collected at the time of delivery." : "This order has been paid online successfully."}
        </div>
      </div>
    </div>
  );
}