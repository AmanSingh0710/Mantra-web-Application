"use client";

import { fetchFromAPI } from "@/utils/api";
import React, { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, MoreVertical, Paperclip, User, ShieldCheck } from "lucide-react";

export default function MessageDetail({ ticketId, setActiveTab }) {

  const [messages, setMessages] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (ticketId) {
      fetchChat();
    }
  }, [ticketId]);

  const fetchChat = async () => {
    try {
      const data = await fetchFromAPI(`/support/chat/${ticketId}`);

      if (data && data.messages) {
        setMessages(data.messages);
        setTicket(data);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to load chat");
      setMessages([]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // ✅ NO localhost, NO headers
      await fetchFromAPI("/support/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketId: ticketId, text: newMessage }),
      });

      setNewMessage("");
      fetchChat();
    } catch (err) {
      console.error("Send failed");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
      {/* --- Chat Header --- */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          {/* Back Button for all screens now since it's a tab */}
          <button onClick={() => setActiveTab("support_inbox")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200">
              <User size={20} className="text-amber-600" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm md:text-base flex items-center gap-2">
              {ticket?.user?.name || "Customer Support"}
              <ShieldCheck size={14} className="text-blue-500" />
            </h2>
            <p className="text-xs text-gray-500">Online | ID: #{ticketId?.slice(-6)}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* --- Messages Area --- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#f0f2f5]">
        {/* 5. Final safety check: Ensure messages is an array before mapping */}
        {Array.isArray(messages) && messages.map((msg, index) => {
          const isMe = msg.onModel === "Employee";
          return (
            <div key={msg._id || index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] md:max-w-[70%] px-4 py-2 rounded-2xl shadow-sm relative 
                ${isMe
                  ? "bg-amber-500 text-white rounded-tr-none"
                  : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text || msg.message}</p>
                <p className={`text-[10px] mt-1 text-right ${isMe ? "text-amber-100" : "text-gray-400"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* --- Input Area --- */}
      <form onSubmit={handleSend} className="bg-white p-3 md:p-4 border-t border-gray-200 flex items-center gap-2 md:gap-4">
        <button type="button" className="p-2 text-gray-400 hover:text-amber-500 transition-colors">
          <Paperclip size={22} />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your reply here..."
          className="flex-1 bg-gray-100 border-none rounded-full px-5 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none text-black"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-black p-2.5 rounded-full shadow-lg transition-all transform active:scale-95 cursor-pointer"
        >
          <Send size={20} fill="currentColor" />
        </button>
      </form>
    </div>
  );
}