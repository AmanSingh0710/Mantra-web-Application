// components/delivery/wallet/DeliveryWallet.jsx
"use client";

import { useEffect, useState } from "react";
import { Wallet, RefreshCw, ArrowUpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";
import WalletHistory from "./WalletHistory";

export default function DeliveryWallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const loadWallet = async () => {
    try {
      setLoading(true);
      const res = await fetchFromAPI("/deliveryBoy/wallet");
      setWallet(res.data || res);
    } catch (e) {
      toast.error("Failed to load wallet");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadWallet(); }, []);

  const requestWithdraw = async () => {
    if (!withdrawAmount) return toast.error("Enter amount");
    try {
      await fetchFromAPI("/deliveryBoy/wallet/withdraw", {
        method: "POST",
        body: JSON.stringify({ amount: Number(withdrawAmount) })
      });
      toast.success("Withdraw request submitted");
      setWithdrawAmount("");
      loadWallet();
    } catch {
      toast.error("Withdraw failed");
    }
  };

  if (loading) {
    return <div className="p-8 bg-white rounded-xl border">Loading wallet...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900"><Wallet /> Delivery Wallet</h1>
        <button onClick={loadWallet} className="border rounded-lg px-4 py-2 flex gap-2 items-center text-gray-900">
          <RefreshCw size={18} />Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 text-gray-900">
        <Card title="Available Balance" value={wallet?.balance || 0} />
        <Card title="Pending Balance" value={wallet?.pendingBalance || 0} />
        <Card title="Total Earnings" value={wallet?.totalCredited || 0} />
        <Card title="Withdrawn" value={wallet?.totalDebited || 0} />
      </div>

      <div className="bg-white border rounded-xl p-6 text-gray-900">
        <h2 className="font-semibold mb-4">Withdraw Request</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
            type="number" className="border rounded-lg px-4 py-2 flex-1" placeholder="Enter amount" />
          <button onClick={requestWithdraw}
            className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2">
            <ArrowUpCircle size={18} />Request Withdraw
          </button>
        </div>
      </div>

      <WalletHistory />
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-white border rounded-xl p-5 text-gray-900">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2">₹{value}</h3>
    </div>
  );
}
