"use client";

import Link from "next/link";
import {ShoppingBag} from "lucide-react";

export default function EmptyOrders(){
  return(
    <div className="mt-10 rounded-xl border bg-white p-10 text-center">
      <ShoppingBag
        size={60}
        className="mx-auto text-gray-400"
      />

      <h2 className="mt-4 text-2xl font-bold">
        No Orders Found
      </h2>

      <p className="mt-2 text-gray-500">
        Looks like you haven't placed any order yet.
      </p>

      <Link
        href="/products"
        className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
      >
        Continue Shopping
      </Link>
    </div>
  );
}