"use client";
export default function OrderStatusBadge({status}){

  const styles={
    Pending:"bg-yellow-100 text-yellow-700",
    Confirmed:"bg-blue-100 text-blue-700",
    Processing:"bg-purple-100 text-purple-700",
    Packed:"bg-orange-100 text-orange-700",
    Shipped:"bg-cyan-100 text-cyan-700",
    "Out For Delivery":"bg-indigo-100 text-indigo-700",
    Delivered:"bg-green-100 text-green-700",
    Cancelled:"bg-red-100 text-red-700",
    "Return Requested":"bg-pink-100 text-pink-700",
    Returned:"bg-gray-200 text-gray-700",
    Refunded:"bg-emerald-100 text-emerald-700"
  };

  return(
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]||"bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}