"use client";

import RefundStatusBadge from "./RefundStatusBadge";

export default function RefundTable({refunds = [], onView,}) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">

            <table className="w-full">

                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 text-left">
                            Order ID
                        </th>

                        <th className="p-4 text-left">
                            Customer
                        </th>

                        <th className="p-4 text-left">
                            Amount
                        </th>

                        <th className="p-4 text-left">
                            Reason
                        </th>

                        <th className="p-4 text-left">
                            Status
                        </th>

                        <th className="p-4 text-left">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {refunds.map((refund) => (
                        <tr
                            key={refund._id}
                            className="border-t hover:bg-gray-50"
                        >
                            <td>{refund.refundNumber}</td>

                            <td>
                                {refund.orderId?.orderNumber}
                            </td>

                            <td>
                                {refund.userId?.name}
                            </td>

                            <td>
                                ₹{refund.amount}
                            </td>

                            <td>
                                {refund.reason}
                            </td>

                            <td>
                                {refund.status}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}