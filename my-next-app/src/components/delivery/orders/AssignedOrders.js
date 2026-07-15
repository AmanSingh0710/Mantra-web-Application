// components/delivery/orders/AssignedOrders.jsx
"use client";

import {useEffect,useState} from "react";
import {fetchFromAPI} from "@/utils/api";
import toast from "react-hot-toast";
import OrderCard from "./OrderCard";
import OrderDetails from "./OrderDetails";

export default function AssignedOrders(){
 const [orders,setOrders]=useState([]);
 const [selected,setSelected]=useState(null);
 const [loading,setLoading]=useState(true);

 const load=async()=>{
   try{
     setLoading(true);
     const res=await fetchFromAPI("/deliveryBoy/orders/assigned");
     const data=res.data||res;
     setOrders(data.orders||[]);
   }catch(e){
     toast.error("Failed to load assigned orders");
   }finally{
     setLoading(false);
   }
 };

 const acceptOrder=async(id)=>{
   try{
     await fetchFromAPI(`/deliveryBoy/accept-order/${id}`,{method:"PATCH"});
     toast.success("Order accepted");
     load();
   }catch{
     toast.error("Unable to accept order");
   }
 };

 useEffect(()=>{load();},[]);

 if(selected) return <OrderDetails order={selected} onBack={()=>setSelected(null)}/>;

 if(loading) return <div className="py-10 text-center">Loading...</div>;

 return (
   <div className="space-y-4">
     {orders.length===0 && <div className="text-center py-10">No assigned orders.</div>}
     {orders.map(order=>(
       <div key={order._id} className="space-y-3">
         <OrderCard order={order} onView={setSelected}/>
         <div className="flex justify-end">
           <button
             onClick={()=>acceptOrder(order._id)}
             className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
             Accept Order
           </button>
         </div>
       </div>
     ))}
   </div>
 );
}
