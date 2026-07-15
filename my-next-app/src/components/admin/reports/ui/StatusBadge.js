"use client";

const variants = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
  failed: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }) {
  const key = status?.toLowerCase() || "inactive";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        variants[key] || variants.inactive
      }`}
    >
      {status}
    </span>
  );
}