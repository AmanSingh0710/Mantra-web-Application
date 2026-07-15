"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchFromAPI } from "@/utils/api";
import toast from "react-hot-toast";

import OrderHeader from "@/components/customer/Orders/details/OrderHeader";
import OrderTimeline from "@/components/customer/Orders/details/OrderTimeline";
import OrderProducts from "@/components/customer/Orders/details/OrderProducts";
import ShippingAddress from "@/components/customer/Orders/details/ShippingAddress";
import PaymentDetails from "@/components/customer/Orders/details/PaymentDetails";
import OrderSummary from "@/components/customer/Orders/details/OrderSummary";
import OrderActions from "@/components/customer/Orders/details/OrderActions";
import InvoiceCard from "@/components/customer/Orders/details/InvoiceCard";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetchFromAPI(`/order/details/${orderId}`);
      setOrder(res.order);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
      router.push("/my-orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return <div className="py-20 text-center text-gray-500">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="mx-auto max-w-7xl space-y-6 px-4">
        <OrderHeader order={order} />
        <OrderTimeline order={order} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <OrderProducts order={order} />
            <ShippingAddress order={order} />
          </div>
          <div className="space-y-6">
            <PaymentDetails order={order} />
            <OrderSummary order={order} />
            <InvoiceCard order={order} />
            <OrderActions order={order} refreshOrder={fetchOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}