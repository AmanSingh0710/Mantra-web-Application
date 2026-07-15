"use client";

import {Search} from "lucide-react";

export default function OrderSearch({value,onChange}){
  return(
    <div className="relative w-full md:w-80">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search Order Number..."
        className="w-full rounded-lg border bg-white py-2 pl-10 pr-4 outline-none transition focus:border-black"
      />
    </div>
  );
}