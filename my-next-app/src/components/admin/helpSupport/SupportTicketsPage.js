"use client";

import { fetchFromAPI } from "@/utils/api";
import React, { useState, useEffect } from "react";
import {Trash2, Edit3, CheckCircle, Filter} from "lucide-react";
import toast from "react-hot-toast";

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await fetchFromAPI("/support/tickets");
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await fetchFromAPI(`/support/tickets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      toast.success(`Ticket marked as ${newStatus}`);
      fetchTickets();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const deleteTicket = async (id) => {
    if (!window.confirm("Are you sure? This will delete all chat history too.")) return;

    try {
      await fetchFromAPI(`/support/tickets/${id}`, {
        method: "DELETE",
      });

      toast.success("Ticket deleted");
      setTickets(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Open': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredTickets = filter === "All" ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="p-4 md:p-8 bg-[#f8f9fa] min-h-screen">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-500 text-sm">Review and manage customer issues</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors shadow-sm">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Tickets Table / Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-400">Loading your tickets...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Ticket Details</th>
                  <th className="px-6 py-4 hidden md:table-cell">Customer</th>
                  <th className="px-6 py-4 hidden md:table-cell">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-amber-600 text-[10px] font-bold uppercase mb-1">#{ticket.ticketId}</span>
                        <span className="text-sm font-semibold text-gray-900 line-clamp-1">{ticket.subject}</span>
                        <span className="text-xs text-gray-400 md:hidden mt-1">{ticket.user?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                          {ticket.user?.name?.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-600">{ticket.user?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${ticket.priority === 'Urgent' ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-50'
                        }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusStyle(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updateStatus(ticket._id, "Resolved")}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Mark Resolved"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => window.location.href = `/admin/support/messages/${ticket._id}`}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => deleteTicket(ticket._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}