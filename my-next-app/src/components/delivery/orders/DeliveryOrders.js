"use client";
import { useState } from "react";
import AssignedOrders from "./AssignedOrders";
import ActiveOrders from "./ActiveOrders";
import CompletedOrders from "./CompletedOrders";
import CancelledOrders from "./CancelledOrders";
import ReturnedOrders from "./ReturnedOrders";

export default function DeliveryOrders() {
     const [tab,setTab]=useState("assigned");
    const tabs = [["assigned", "Assigned"], ["active", "Active"], ["completed", "Completed"], ["cancelled", "Cancelled"], ["returned", "Returned"]];
    return (
        <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
                {tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-lg ${tab === k ? "bg-black text-white" : "border"}`}>{l}</button>)}
            </div>
            {tab === "assigned" && <AssignedOrders />}
            {tab === "active" && <ActiveOrders />}
            {tab === "completed" && <CompletedOrders />}
            {tab === "cancelled" && <CancelledOrders />}
            {tab === "returned" && <ReturnedOrders />}
        </div>);
}
