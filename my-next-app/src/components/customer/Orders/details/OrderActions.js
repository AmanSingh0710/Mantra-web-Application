"use client";
import { fetchFromAPI } from "@/utils/api";
import { RotateCcw, XCircle, Star } from "lucide-react";
import toast from "react-hot-toast";
export default function OrderActions({ order, refreshOrder }) {
  const cancelOrder = async () => {
    const reason = prompt("Cancel reason");
    if (reason === null) return;
    try {
      await fetchFromAPI(`/order/${order._id}/cancel`, { method: "PUT", body: JSON.stringify({ reason }) });
      toast.success("Order cancelled");
      refreshOrder();
    } catch (err) {
      toast.error(err.message);
    }
  };
  const requestReturn = async () => {
    const reason = prompt("Return reason");
    if (reason === null) return;
    try {
      await fetchFromAPI(`/order/${order._id}/request-return`, { method: "PUT", body: JSON.stringify({ reason, images: [] }) });
      toast.success("Return request submitted");
      refreshOrder();
    } catch (err) {
      toast.error(err.message);
    }
  };
  const addReview = () => { toast("Review page coming soon."); };
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold">Order Actions</h2>
      <div className="space-y-3">
        {!["Cancelled", "Delivered", "Returned", "Refunded"].includes(order.status) && (
          <button onClick={cancelOrder} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700"><XCircle size={18} />Cancel Order</button>
        )}
        {order.status === "Delivered" && !order.returnRequest?.requested && (
          <button onClick={requestReturn} className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 font-medium text-white transition hover:bg-orange-600"><RotateCcw size={18} />Request Return</button>
        )}
        {order.status === "Delivered" && (
          <button onClick={addReview} className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800"><Star size={18} />Write Review</button>
        )}
      </div>
    </div>
  );
}