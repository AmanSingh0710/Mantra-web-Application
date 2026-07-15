"use client";
import { useState, useEffect } from "react";
import { FaSearch, FaFileDownload, FaEye, FaTrash, FaUserCircle } from "react-icons/fa";
import * as XLSX from "xlsx";
import { fetchFromAPI } from "@/utils/api"; // ✅ IMPORT

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ 1. FETCH CUSTOMERS
  const fetchCustomers = async (query = "") => {
    try {
      setLoading(true);

      const data = await fetchFromAPI(`/admin/customers?search=${query}`);

      setCustomers(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ✅ 2. SEARCH
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers(searchQuery);
  };

  // ✅ 3. EXPORT EXCEL
  const exportToExcel = () => {
    const dataToExport = customers.map((c, index) => ({
      SL: index + 1,
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      Total_Orders: c.orderCount || 0,
      Status: c.isBlocked ? "Blocked" : "Active",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, "Customer_List.xlsx");
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-[#334257]">Customer List</h2>
          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
            {customers.length}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 sm:min-w-[300px]">
            <input
              type="text"
              placeholder="Search by Name, Email or Phone"
              className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1.5 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FaSearch size={14} />
            </button>
          </form>

          <button
            onClick={exportToExcel}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
          >
            <FaFileDownload /> Export
          </button>
        </div>
      </div>

      {/* Table Section - Responsive Scroll */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f8f9fb]">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">SL</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Name</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Total Order</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Block/Unblock</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="6" className="p-10 text-center text-gray-400">Loading data...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan="6" className="p-10 text-center text-gray-400">No customers found</td></tr>
            ) : (
              customers.map((customer, index) => (
                <tr key={customer._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-600">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        {customer.image ? <img src={customer.image} className="w-full h-full rounded-full object-cover" /> : <FaUserCircle size={30} />}
                      </div>
                      <span className="text-sm font-bold text-[#334257] capitalize">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-700 font-medium">{customer.email}</div>
                    <div className="text-xs text-gray-400">{customer.phone}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
                      {customer.orderCount || 0}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={!customer.isBlocked} className="sr-only peer" readOnly />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-blue-500 border border-blue-100 rounded-lg hover:bg-blue-50"><FaEye size={14} /></button>
                      <button className="p-2 text-red-500 border border-red-100 rounded-lg hover:bg-red-50"><FaTrash size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}