// components/delivery/wallet/WalletHistory.jsx
"use client";

import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import toast from "react-hot-toast";

export default function WalletHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = async (p = 1) => {
    try {
      setLoading(true);
      const res = await fetchFromAPI(`/deliveryBoy/wallet/history?page=${p}`);
      const data = res.data || res;
      setRows(data.transactions || []);
      setPages(data.totalPages || 1);
      setPage(p);
    } catch (e) {
      toast.error("Failed to load wallet history");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="bg-white border rounded-xl p-6">Loading transactions...</div>;

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="p-5 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Wallet History</h2>
      </div>

      <div className="overflow-x-auto text-gray-900">
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-900">
            <tr>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Reference</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="5" className="p-6 text-center">No transactions found.</td></tr>
            ) : rows.map(tx => (
              <tr key={tx._id} className="border-t">
                <td className="p-3">{new Date(tx.createdAt).toLocaleString()}</td>
                <td className="p-3">{tx.type}</td>
                <td className={`p-3 font-semibold ${tx.type === "Credit" ? "text-green-600" : "text-red-600"}`}>₹{tx.amount}</td>
                <td className="p-3">{tx.status}</td>
                <td className="p-3">{tx.reference || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2 p-4 border-t">
        <button disabled={page <= 1} onClick={() => load(page - 1)} className="border rounded px-3 py-2 disabled:opacity-50">Prev</button>
        <span className="px-2 py-2">{page}/{pages}</span>
        <button disabled={page >= pages} onClick={() => load(page + 1)} className="border rounded px-3 py-2 disabled:opacity-50">Next</button>
      </div>
    </div>);
}
