"use client";

import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import {MapPinned,Navigation,User,Phone,Package,Clock3,CheckCircle2,} from "lucide-react";

export default function TrackingPage() {
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracking();
  }, []);

  const loadTracking = async () => {
    try {
      const data = await fetchFromAPI("/deliveryBoy/tracking");
      setTracking(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-lg font-semibold">Loading Tracking...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center gap-3">
        <MapPinned className="text-orange-500" size={32} />
        <div>
          <h1 className="text-3xl font-black">Live Tracking</h1>
          <p className="text-gray-500">
            Manage your active deliveries
          </p>
        </div>
      </div>

      {tracking.length === 0 ? (
        <div className="bg-white rounded-3xl border p-10 text-center">
          <Package className="mx-auto text-gray-300" size={70} />
          <h2 className="text-2xl font-bold mt-5">
            No Active Delivery
          </h2>
          <p className="text-gray-500 mt-2">
            You don't have any delivery assigned.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">

          {tracking.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl border shadow-sm p-7"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-8">

                <div className="space-y-5">

                  <div className="flex items-center gap-3">
                    <Package className="text-orange-500" />
                    <div>
                      <p className="text-gray-500 text-sm">
                        Order ID
                      </p>
                      <h2 className="font-black">
                        #{item._id?.slice(-8)}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="text-blue-500" />
                    <div>
                      <p className="text-gray-500 text-sm">
                        Customer
                      </p>
                      <h3 className="font-semibold">
                        {item.customerName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="text-green-500" />
                    <div>
                      <p className="text-gray-500 text-sm">
                        Phone
                      </p>
                      <h3 className="font-semibold">
                        {item.customerPhone}
                      </h3>
                    </div>
                  </div>

                </div>

                <div className="space-y-5">

                  <div className="flex items-center gap-3">
                    <Navigation className="text-purple-500" />
                    <div>
                      <p className="text-gray-500 text-sm">
                        Delivery Address
                      </p>
                      <h3 className="font-semibold">
                        {item.address}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock3 className="text-yellow-500" />
                    <div>
                      <p className="text-gray-500 text-sm">
                        Delivery Status
                      </p>

                      <span className="inline-flex items-center gap-2 mt-1 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold">
                        <CheckCircle2 size={18} />
                        {item.status}
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}