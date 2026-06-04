"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import { Search, Mail, Users } from "lucide-react";

export default function SubscriberList() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetchFromAPI("/subscribers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubscribers(response?.data || []);
    } catch (error) {
      console.error("Subscriber fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber) =>
      subscriber.email
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, subscribers]);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="bg-white rounded-xl shadow-sm border p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Newsletter Subscribers
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all newsletter subscribers
            </p>
          </div>

          <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg text-black">
            <Users size={20} />
            <div>
              <p className="text-xs text-gray-500">
                Total Subscribers
              </p>
              <p className="font-bold text-lg">
                {subscribers.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow-sm border p-4 text-black">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-3.5 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Desktop Table */}

      <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden text-black">
        <div className="overflow-x-auto">
          <table className="w-full">

            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Email
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Source
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold">
                  Joined Date
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-10"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-10 text-gray-500"
                  >
                    No subscribers found
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr
                    key={subscriber._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Mail size={18} />
                        {subscriber.email}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        {subscriber.source || "Website"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(
                        subscriber.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Mobile Cards */}

      <div className="md:hidden space-y-3 text-black">
        {loading ? (
          <div className="bg-white rounded-xl p-6 text-center">
            Loading...
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center">
            No subscribers found
          </div>
        ) : (
          filteredSubscribers.map((subscriber) => (
            <div
              key={subscriber._id}
              className="bg-white rounded-xl border shadow-sm p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Mail size={18} />
                <span className="font-medium break-all">
                  {subscriber.email}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  {subscriber.source || "Website"}
                </span>

                <span className="text-gray-500">
                  {new Date(
                    subscriber.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}