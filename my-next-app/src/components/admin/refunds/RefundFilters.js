"use client";

import { FaSearch } from "react-icons/fa";

export default function RefundFilters({search, setSearch,}) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex gap-4 flex-wrap">

        <div className="flex-1 min-w-[250px]">
          <div className="border rounded-lg px-3 py-2 flex items-center gap-2">
            <FaSearch />

            <input
              type="text"
              placeholder="Search Order ID..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="outline-none w-full"
            />
          </div>
        </div>

        <select className="border rounded-lg px-4 py-2">
          <option>All Reasons</option>
          <option>Damaged Product</option>
          <option>Wrong Product</option>
          <option>Quality Issue</option>
        </select>

      </div>
    </div>
  );
}