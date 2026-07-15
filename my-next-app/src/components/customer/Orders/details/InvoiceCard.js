"use client";
import { FileText, Download, Hash } from "lucide-react";

export default function InvoiceCard({ order }) {
    const downloadInvoice = () => {
        if (!order.invoiceUrl) {
            return alert("Invoice not available yet.");
        }
        downloadFile(`/order/${order._id}/invoice`, `${order.orderNumber}.pdf`);
    };
    
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
                <FileText size={20} />
                <h2 className="text-lg font-semibold">Invoice</h2>
            </div>
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">Invoice Number</span>
                    <div className="flex items-center gap-2 font-semibold">
                        <Hash size={16} />
                        {order.invoiceNumber || "Not Generated"}
                    </div>
                </div>
                <button onClick={downloadInvoice} disabled={!order.invoiceUrl} className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition ${order.invoiceUrl ? "bg-black text-white hover:bg-gray-800" : "cursor-not-allowed bg-gray-200 text-gray-500"}`}>
                    <Download size={18} />
                    Download Invoice
                </button>
                {!order.invoiceUrl && (
                    <p className="text-center text-sm text-gray-500">Invoice will be available after the order is processed.</p>
                )}
            </div>
        </div>
    );
}