// components/delivery/orders/OrderDetails.js
"use client";

import { ArrowLeft, Phone, MapPin, Package, IndianRupee } from "lucide-react";
import Image from "next/image";

export default function OrderDetails({ order, onBack }) {
  if (!order) {
    return (
      <div className="p-6 bg-white rounded-xl border">
        <p className="text-gray-500">No order selected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-2xl font-bold" text-black>
          Order #{order.orderNumber || order._id?.slice(-8)}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white border rounded-xl p-6">
            <h2 className="font-semibold mb-4 text-black">Products</h2>

            <div className="space-y-4 text-black">
              {order.products?.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 border rounded-lg p-3"
                >
                  <Image
                    src={item.image || "/images/product.png"}
                    alt={item.name || "Product"}
                    width={70}
                    height={70}
                    className="rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Qty : {item.quantity}
                    </p>

                    <p className="font-semibold flex items-center gap-1 mt-2">
                      <IndianRupee size={16}/>
                      {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="space-y-6 text-black">
          <div className="bg-white border rounded-xl p-6">
            <h2 className="font-semibold mb-4">
              Customer
            </h2>

            <div className="flex items-center gap-4">
              <Image
                src={order.userId?.image}
                alt=""
                width={60}
                height={60}
                className="rounded-full"
              />

              <div>
                <h3 className="font-semibold">
                  {order.userId?.name}
                </h3>

                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone size={14}/>
                  {order.userId?.mobile}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <h2 className="font-semibold mb-4">
              Delivery Address
            </h2>

            <p className="flex gap-2 text-sm">
              <MapPin size={16}/>
              {order.shipping.address},
              {order.shipping.city},
              {order.shipping.state}
              {" - "}
              {order.shipping.pin}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <h2 className="font-semibold mb-4">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>{order.products.length || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Payment</span>
                <span>{order.payment?.method}</span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{order.pricing?.grandTotal}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
