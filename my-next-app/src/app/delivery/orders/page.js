"use client";

import {
  useEffect,
  useState,
} from "react";

import { fetchFromAPI }
from "@/utils/api";

export default function OrdersPage() {

  const [orders, setOrders] =
    useState([]);

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const data =
          await fetchFromAPI(
            "/delivery-boy/my-orders"
          );

        setOrders(data);

      } catch (error) {

        console.log(error.message);

      }
    };

    fetchOrders();

  }, []);

  return (
    <div className="space-y-6">

      <h1 className="text-4xl font-black text-gray-900">
        My Orders
      </h1>

      <div className="grid gap-5">

        {orders.map((order) => (

          <div
            key={order._id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
          >

            <div className="flex justify-between items-center">

              <div>

                <h2 className="text-xl font-black">
                  Order #
                  {order._id.slice(-6)}
                </h2>

                <p className="text-gray-500 mt-2">
                  ₹{order.totalAmount}
                </p>

              </div>

              <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-bold">
                {order.deliveryStatus}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}