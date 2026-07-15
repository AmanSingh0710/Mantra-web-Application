// src/components/customer/account/address/AddressPage.js

"use client";

import { MapPin, Plus } from "lucide-react";

export default function AddressPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Saved Addresses
          </h1>

          <p className="mt-1 text-gray-500">
            Manage your delivery addresses.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800">
          <Plus size={18} />
          Add New Address
        </button>
      </div>

      {/* Empty State */}
      <div className="rounded-xl border bg-white p-16 text-center shadow-sm">
        <MapPin
          size={60}
          className="mx-auto text-gray-400"
        />

        <h2 className="mt-5 text-xl font-semibold">
          No Saved Address
        </h2>

        <p className="mt-2 text-gray-500">
          Add your first delivery address to make checkout faster.
        </p>

        <button className="mt-6 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800">
          Add Address
        </button>
      </div>
    </div>
  );
}