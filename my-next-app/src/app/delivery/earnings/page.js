"use client";

import {useEffect,useState,} from "react";

import {fetchFromAPI} from "@/utils/api";

export default function EarningsPage() {

  const [earnings, setEarnings] =
    useState({});

  useEffect(() => {

    const fetchEarnings =
      async () => {

      try {

        const data =await fetchFromAPI("/deliveryBoy/earnings");

        setEarnings(data);

      } catch (error) {

        console.log(error.message);

      }
    };

    fetchEarnings();

  }, []);

  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-black text-gray-900">
        Earnings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <p className="text-gray-400 font-semibold">
            Wallet Balance
          </p>

          <h2 className="text-4xl font-black mt-3">
            ₹{earnings.walletBalance || 0}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <p className="text-gray-400 font-semibold">
            Total Earnings
          </p>

          <h2 className="text-4xl font-black mt-3">
            ₹{earnings.totalEarnings || 0}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <p className="text-gray-400 font-semibold">
            Pending Payout
          </p>

          <h2 className="text-4xl font-black mt-3">
            ₹{earnings.pendingPayout || 0}
          </h2>
        </div>

      </div>

    </div>
  );
}