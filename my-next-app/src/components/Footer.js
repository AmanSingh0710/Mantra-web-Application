"use client";

import Link from "next/link";
import VisitorStats from "@/components/VisitorStats";
import { FaFacebookF, FaInstagram, FaPinterestP, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-300 border-t border-gray-800/80 font-sans select-none antialiased">
      
      {/* 1. MASTER LINK GRID MATRIX */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 lg:gap-10">
          

          {/* COLUMN 1: SHOP */}
          <div className="flex flex-col space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest border-b border-gray-800 pb-2 mb-1">SHOP</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-400 font-medium">
              <Link href="/skin" className="hover:text-amber-500 transition-colors duration-200">Skin</Link>
              <Link href="/bath-body" className="hover:text-amber-500 transition-colors duration-200">Bath & Body</Link>
              <Link href="/hair" className="hover:text-amber-500 transition-colors duration-200">Hair</Link>
              <Link href="/men" className="hover:text-amber-500 transition-colors duration-200">Men</Link>
              <Link href="/spa" className="hover:text-amber-500 transition-colors duration-200">Spa</Link>
              <Link href="/anantam" className="hover:text-amber-500 transition-colors duration-200">Anantam</Link>
              <Link href="/kits-gifting" className="hover:text-amber-500 transition-colors duration-200">Kits & Gifting</Link>
              <Link href="/combos" className="hover:text-amber-500 transition-colors duration-200">Combos</Link>
              <Link href="/exclusive-deals" className="hover:text-amber-500 transition-colors duration-200 text-amber-500 font-semibold">Exclusive Deals</Link>
            </div>
          </div>

          {/* COLUMN 2: ABOUT */}
          <div className="flex flex-col space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest border-b border-gray-800 pb-2 mb-1">ABOUT</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-400 font-medium">
              <Link href="/about" className="hover:text-amber-500 transition-colors duration-200">About Us</Link>
              <Link href="/story" className="hover:text-amber-500 transition-colors duration-200">Our Story</Link>
              <Link href="/about" className="hover:text-amber-500 transition-colors duration-200">About Baidyanath</Link>
              <Link href="/media-press" className="hover:text-amber-500 transition-colors duration-200">Media & Press</Link>
              <Link href="/blogs" className="hover:text-amber-500 transition-colors duration-200">Blogs</Link>
            </div>
          </div>

          {/* COLUMN 3: CUSTOMER CARE */}
          <div className="flex flex-col space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest border-b border-gray-800 pb-2 mb-1">CUSTOMER CARE</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-400 font-medium">
              <Link href="/contact" className="hover:text-amber-500 transition-colors duration-200">Contact Us</Link>
              <Link href="/shipping-policy" className="hover:text-amber-500 transition-colors duration-200">Shipping Policy</Link>
              <Link href="/cancellation-policy" className="hover:text-amber-500 transition-colors duration-200">Cancellation Policy</Link>
              <Link href="/return-refund" className="hover:text-amber-500 transition-colors duration-200">Return & Refund Policy</Link>
              <Link href="/privacy-policy" className="hover:text-amber-500 transition-colors duration-200">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-amber-500 transition-colors duration-200">Terms & Conditions</Link>
              <Link href="/disclaimer" className="hover:text-amber-500 transition-colors duration-200">Disclaimer</Link>
              <Link href="/faq" className="hover:text-amber-500 transition-colors duration-200">FAQs</Link>
            </div>
          </div>

          {/* COLUMN 4: AVAILABLE AT */}
          <div className="flex flex-col space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest border-b border-gray-800 pb-2 mb-1">AVAILABLE AT</h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-400 font-medium">
              <Link href="https://amazon.in" target="_blank" className="hover:text-amber-500 transition-colors duration-200">Amazon</Link>
              <Link href="https://nykaa.com" target="_blank" className="hover:text-amber-500 transition-colors duration-200">Nykaa</Link>
              <Link href="https://flipkart.com" target="_blank" className="hover:text-amber-500 transition-colors duration-200">Flipkart</Link>
              <Link href="#" className="hover:text-amber-500 transition-colors duration-200">Tira</Link>
              <Link href="https://myntra.com" target="_blank" className="hover:text-amber-500 transition-colors duration-200">Myntra</Link>
              <Link href="#" className="hover:text-amber-500 transition-colors duration-200">Purplle</Link>
              <Link href="#" className="hover:text-amber-500 transition-colors duration-200">Firstcry</Link>
            </div>
          </div>

          {/* COLUMN 5: ADDRESS & METADATA (Spans full rows on tiny mobile displays) */}
          <div className="col-span-2 sm:col-span-1 flex flex-col space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest border-b border-gray-800 pb-2 mb-1">ADDRESS</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              31, Link Road, Opp. Defence Colony, Block A, Lajpat Nagar III, New Delhi – 110024, India
            </p>
            <div className="text-xs space-y-1.5 text-gray-400 pt-1">
              <p>Email: <a href="mailto:info@mantraherbal.in" className="text-amber-500 hover:underline">info@mantraherbal.in</a></p>
              <p>Toll-Free: <a href="tel:18001028384" className="text-white hover:text-amber-500 font-semibold transition-colors">1800-1028384</a></p>
            </div>

            {/* Premium Icon Social Matrix */}
            <div className="flex items-center gap-3 pt-3">
              <Link href="#" className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-white hover:bg-amber-600 transition-all duration-300 shadow-inner"><FaFacebookF className="text-xs" /></Link>
              <Link href="#" className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-white hover:bg-amber-600 transition-all duration-300 shadow-inner"><FaXTwitter className="text-xs" /></Link>
              <Link href="#" className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-white hover:bg-amber-600 transition-all duration-300 shadow-inner"><FaInstagram className="text-xs" /></Link>
              <Link href="#" className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-white hover:bg-amber-600 transition-all duration-300 shadow-inner"><FaPinterestP className="text-xs" /></Link>
              <Link href="#" className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-white hover:bg-amber-600 transition-all duration-300 shadow-inner"><FaLinkedinIn className="text-xs" /></Link>
            </div>
          </div>

        </div>
      </div>

      

      {/* 3. GATEWAY VALIDATION ASSETS (Payment Gateway Strip) */}
      <div className="border-t border-gray-800/60 bg-black/40 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">100% Secure Checkout Guaranteed</span>
          <div className="flex flex-wrap items-center justify-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <a href="https://www.americanexpress.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-all grayscale hover:grayscale-0"><img src="/Amex.avif" alt="Amex" className="h-5 w-auto object-contain" /></a>
            <a href="https://www.mastercard.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-all grayscale hover:grayscale-0"><img src="/Mastercard.avif" alt="Mastercard" className="h-5 w-auto object-contain" /></a>
            <a href="https://www.paypal.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-all grayscale hover:grayscale-0"><img src="/Paypal.webp" alt="Paypal" className="h-5 w-auto object-contain" /></a>
            <a href="https://pay.google.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-all grayscale hover:grayscale-0"><img src="/Gpay.webp" alt="Google Pay" className="h-4 w-auto object-contain" /></a>
            <a href="https://www.upi.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-all grayscale hover:grayscale-0"><img src="/UPI.webp" alt="UPI" className="h-4 w-auto object-contain" /></a>
          </div>
        </div>
      </div>

      {/* 🌟 2. THE ENTERPRISE INTELLIGENCE INTERCEPTOR (Live System Metrics) */}
      <div className="border-t border-gray-800/60 bg-black/40">
        <VisitorStats />
      </div>

      {/* 4. BASELINE COMPLIANCE AND RIGHTS CORRIDOR */}
      <div className="border-t border-gray-900 bg-black py-4 px-4 text-center text-[10px] font-semibold text-gray-500 tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 uppercase">
          <p>© {new Date().getFullYear()} MANTRA HERBAL. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-4 text-gray-400 text-[9px]">
            <Link href="/privacy-policy" className="hover:underline hover:text-white transition">Privacy Matrix</Link>
            <Link href="/terms" className="hover:underline hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}