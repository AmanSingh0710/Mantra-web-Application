"use client";

import { fetchFromAPI } from "@/utils/api";
import React, { useState, useEffect } from "react";
import { Search, Download, Eye, Trash2, Users } from "lucide-react";

export default function CustomerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ================= FETCH CUSTOMERS =================
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const data = await fetchFromAPI("/auth/all", {
        method: "GET",
      });

      const list = data?.users || data || [];

      setCustomers(list);
      setFilteredCustomers(list);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH =================
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const q = searchQuery.toLowerCase();

    setFilteredCustomers(
      customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, customers]);

  // ================= TOGGLE BLOCK =================
  const toggleBlock = async (id) => {
    try {
      const customer = customers.find((c) => c._id === id || c.id === id);
      const newBlocked = !customer.blocked;

      await fetchFromAPI(`/auth/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ blocked: newBlocked }),
      });

      setCustomers((prev) =>
        prev.map((c) =>
          c._id === id || c.id === id ? { ...c, blocked: newBlocked } : c
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    try {
      await fetchFromAPI(`/auth/${id}`, {
        method: "DELETE",
      });

      setCustomers((prev) =>
        prev.filter((c) => c._id !== id && c.id !== id)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleView = (id) => console.log("View customer", id);


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Users className="w-7 h-7 text-gray-700" />
          <h1 className="text-2xl font-semibold text-gray-800">Customer List</h1>
          <span className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full ml-2">
            {filteredCustomers.length}
          </span>
        </div>

        {/* Search & Export */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Name, Email, or Phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => { }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-r-md font-medium transition-colors"
            >
              Search
            </button>
          </div>

          <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-md hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export <span className="ml-1">▼</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading customers...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
            <button
              onClick={fetchCustomers}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">SL</th>
                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold">Orders</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        {searchQuery ? "No customers found" : "No customers available"}
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer, idx) => (
                      <tr key={customer._id || customer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">{idx + 1}</td>

                        {/* 1. NAME AND IMAGE COLUMN */}
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                            {customer.image ? (
                              <img
                                src={customer.image}
                                alt={customer.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random`;
                                }}
                              />
                            ) : (
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random&color=fff`}
                                alt="avatar"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <span className="font-medium text-gray-800">{customer.name}</span>
                        </td>

                        {/* 2. CONTACT COLUMN (Email & Mobile) */}
                        <td className="px-6 py-4">
                          <div className="text-gray-900">{customer.email}</div>
                          <div className="text-gray-500">{customer.mobile || customer.phone || "N/A"}</div>
                        </td>

                        {/* 3. ORDERS COLUMN */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center bg-blue-50 text-blue-600 font-semibold text-sm px-3 py-1 rounded">
                            {customer.totalOrders || 0}
                          </span>
                        </td>

                        {/* 4. STATUS (BLOCK/UNBLOCK) COLUMN */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleBlock(customer._id || customer.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${customer.blocked ? "bg-red-500" : "bg-green-500"
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${customer.blocked ? "translate-x-6" : "translate-x-1"
                                }`}
                            />
                          </button>
                        </td>

                        {/* 5. ACTIONS COLUMN */}
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => handleView(customer._id || customer.id)}
                            className="p-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id || customer.id)}
                            className="p-2 border border-red-400 text-red-400 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
