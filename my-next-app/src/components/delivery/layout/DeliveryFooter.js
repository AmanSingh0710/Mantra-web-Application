"use client";

import Link from "next/link";
import { ShieldCheck, Smartphone, Heart } from "lucide-react";

export default function DeliveryFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-white mt-auto">
      <div className="px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-800">Mantra Delivery Partner</h3>
            <p className="text-sm text-gray-500">Fast • Secure • Reliable Deliveries</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-green-600" />
              Secure Dashboard
            </div>
            <div className="flex items-center gap-2">
              <Smartphone size={17} className="text-blue-600" />
              Version 1.0.0
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Made with <Heart size={15} className="fill-red-500 text-red-500" /> by{" "}
            <Link href="/" className="font-semibold text-indigo-600 hover:underline">
              Mantar
            </Link>
          </div>
        </div>
        <div className="border-t mt-4 pt-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© {year} Mantra  All Rights Reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-indigo-600">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-indigo-600">Terms</Link>
            <Link href="/contact-us" className="hover:text-indigo-600">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}