// components/delivery/tracking/DeliveryTracking.jsx
"use client";

import {useEffect,useState} from "react";
import {RefreshCw,Navigation} from "lucide-react";
import toast from "react-hot-toast";
import {fetchFromAPI} from "@/utils/api";
import LiveMap from "./LiveMap";

export default function DeliveryTracking(){
  const [tracking,setTracking]=useState(null);
  const [loading,setLoading]=useState(true);

  const load=async()=>{
    try{
      setLoading(true);
      const res=await fetchFromAPI("/deliveryBoy/tracking");
      setTracking(res.data||res);
    }catch(e){
      toast.error("Failed to load tracking");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{load();},[]);

  if(loading){
    return <div className="bg-white border rounded-xl p-6">Loading tracking...</div>;
  }

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Live Delivery Tracking</h1>
        <button onClick={load} className="border rounded-lg px-4 py-2 flex items-center gap-2">
          <RefreshCw size={18}/> Refresh
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl p-5 space-y-3 text-gray-900">
          <h2 className="font-semibold">Current Delivery</h2>
          <p><b>Order:</b> #{tracking?.orderNumber}</p>
          <p><b>Customer:</b> {tracking?.customerName}</p>
          <p><b>Phone:</b> {tracking?.mobile}</p>
          <p><b>Status:</b> {tracking?.status}</p>
          <p><b>Address:</b> {tracking?.address}</p>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tracking?.address||"")}`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <Navigation size={18}/> Navigate
          </a>
        </div>

        <div className="lg:col-span-2">
          <LiveMap
            latitude={tracking?.latitude}
            longitude={tracking?.longitude}
          />
        </div>
      </div>
    </div>
  );
}
