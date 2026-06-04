"use client";

import { fetchFromAPI, BASE_URL } from "@/utils/api";
import React, { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, CheckCheck, User } from "lucide-react";

export default function InboxPage({ setActiveTab, setSelectedTicketId }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchInbox();
    }, []);

    const fetchInbox = async () => {
        try {
            const data = await fetchFromAPI("/support/inbox");

            if (Array.isArray(data)) setConversations(data);
        } catch (err) {
            console.error("Failed to load inbox");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Customer Inbox</h1>
                    <p className="text-sm text-gray-500">Manage your recent customer conversations</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-full md:w-64"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-600">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Inbox List Area */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-500">Loading conversations...</div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Search size={48} className="mb-2 opacity-20" />
                        <p>No messages found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {conversations
                            .filter(conv => conv.ticket?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((conv) => (
                                <div
                                    key={conv._id}
                                    className="group flex items-start gap-4 p-4 hover:bg-amber-50 cursor-pointer transition-colors relative"
                                    onClick={() => {
                                        setSelectedTicketId(conv.ticket._id);
                                        setActiveTab("support_messages");
                                    }}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                                            {conv.ticket?.user?.image ? (
                                                <img src={`${BASE_URL}/${conv.ticket.user.image}`} alt="user" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="text-gray-400" />
                                            )}
                                        </div>
                                        {conv.isRead === false && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {conv.ticket?.user?.name || "Unknown User"}
                                            </h3>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm truncate max-w-[80%] ${conv.isRead ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                                                {conv.text}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {conv.onModel === 'Employee' && <CheckCheck size={14} className="text-blue-500" />}
                                                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded text-gray-400">
                                                    <MoreVertical size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 uppercase font-bold tracking-tighter">
                                                {conv.ticket?.category || 'General'}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold ${conv.ticket?.status === 'Open' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                {conv.ticket?.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}