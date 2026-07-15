"use client";
import { Receipt, IndianRupee } from "lucide-react";

export default function OrderSummary({ order }) {
  
  const pricing = order.pricing || {};
  const Row = ({ title, value, isDiscount = false, isTotal = false }) => (
    <div className={`flex items-center justify-between ${isTotal ? "border-t pt-4 text-lg font-bold" : "text-sm"}`}>
      <span className={isTotal ? "text-black" : "text-gray-600"}>{title}</span>
      <span className={`inline-flex items-center ${isDiscount ? "text-green-600" : "text-gray-900"}`}>
        {isDiscount && "-"}
        <IndianRupee size={16} />
        {(value || 0).toLocaleString("en-IN")}
      </span>
    </div>
  );

  return (
    <div className="sticky top-24 rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Receipt size={20} />
        <h2 className="text-lg font-semibold">Price Details</h2>
      </div>
      <div className="space-y-4">
        <Row title="Subtotal" value={pricing.subtotal} />
        <Row title="Tax" value={pricing.tax} />
        <Row title="Delivery Charge" value={pricing.deliveryCharge} />
        <Row title="Discount" value={pricing.discount} isDiscount />
        <Row title="Grand Total" value={pricing.grandTotal} isTotal />
      </div>
    </div>
  );
}