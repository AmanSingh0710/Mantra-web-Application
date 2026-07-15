"use client";

export default function RefundDetailsModal({refund, onClose,}) {
  if (!refund) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg p-6 w-[600px]">

        <h2 className="text-xl font-bold mb-4">
          Refund Details
        </h2>

        <div className="space-y-3">
          <p>
            <strong>Order:</strong>{" "}
            {refund.orderId}
          </p>

          <p>
            <strong>Customer:</strong>{" "}
            {refund.customerName}
          </p>

          <p>
            <strong>Amount:</strong> ₹
            {refund.amount}
          </p>

          <p>
            <strong>Reason:</strong>{" "}
            {refund.reason}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {refund.description}
          </p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}