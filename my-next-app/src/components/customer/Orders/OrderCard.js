"use client";

import Image from "next/image";
import Link from "next/link";
import {Package,Calendar,ChevronRight,IndianRupee} from "lucide-react";
import {getImageUrl} from "@/utils/api";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderCard({order}){

  const firstProduct=order.products?.[0];

  const image=getImageUrl(
    firstProduct?.image||
    firstProduct?.productId?.thumbnail?.url
  );

  const productName=
    firstProduct?.name||
    firstProduct?.productId?.productName||
    "Product";

  const totalItems=order.products?.length||0;

  const date=new Date(order.createdAt).toLocaleDateString("en-IN",{
    day:"2-digit",
    month:"short",
    year:"numeric"
  });

  return(
    <div className="mb-5 rounded-xl border bg-white shadow-sm transition hover:shadow-md">

      <div className="flex flex-col gap-5 p-5 lg:flex-row">

        <div className="relative h-28 w-28 overflow-hidden rounded-lg border bg-gray-100">
          <Image
            src={image}
            alt={productName}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">

            <div>

              <h2 className="line-clamp-2 text-lg font-semibold text-gray-800">
                {productName}
              </h2>

              {totalItems>1&&(
                <p className="mt-1 text-sm text-gray-500">
                  +{totalItems-1} more item{totalItems>2?"s":""}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">

                <div className="flex items-center gap-1">
                  <Package size={16}/>
                  {order.orderNumber}
                </div>

                <div className="flex items-center gap-1">
                  <Calendar size={16}/>
                  {date}
                </div>

              </div>

            </div>

            <OrderStatusBadge status={order.status}/>
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center text-lg font-bold text-gray-900">
              <IndianRupee size={18}/>
              {order.pricing?.grandTotal?.toLocaleString("en-IN")}
            </div>

            <Link
              href={`/my-orders/${order._id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              View Details
              <ChevronRight size={18}/>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}