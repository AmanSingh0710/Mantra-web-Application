"use client";
import Image from "next/image";
import Link from "next/link";
import { Package, IndianRupee, ExternalLink } from "lucide-react";
import { getImageUrl } from "@/utils/api";

export default function OrderProducts({ order }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Package size={20} />
        <h2 className="text-lg font-semibold">Ordered Products ({order.products?.length || 0})</h2>
      </div>
      <div className="space-y-5">
        {order.products?.map(item => {
          const image = getImageUrl(item.image || item.productId?.thumbnail?.url);
          const productName = item.name || item.productId?.productName || "Product";
          
          return (
            <div key={item.productId?._id || item.productId} className="flex flex-col gap-5 rounded-xl border p-4 transition hover:shadow-md md:flex-row">
              <div className="relative h-28 w-28 overflow-hidden rounded-lg border bg-gray-100">
                <Image src={image} alt={productName} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{productName}</h3>
                  {item.sku && <p className="mt-1 text-sm text-gray-500">SKU : {item.sku}</p>}
                  <div className="mt-3 flex flex-wrap gap-6 text-sm text-gray-600">
                    <p className="flex items-center">Quantity : <span className="ml-1 font-semibold text-black">{item.quantity}</span></p>
                    <p className="flex items-center">Price : <span className="ml-1 inline-flex items-center font-semibold text-black"><IndianRupee size={14} />{item.price.toLocaleString("en-IN")}</span></p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="text-xl font-bold">
                    <span className="inline-flex items-center"><IndianRupee size={18} />{item.total.toLocaleString("en-IN")}</span>
                  </div>
                  {item.productId?._id && (
                    <Link href={`/product/${item.productId._id}`} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-100">View Product<ExternalLink size={16} /></Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}